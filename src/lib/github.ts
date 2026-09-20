const API = "https://api.github.com";

export type GitHubFile = { path: string; data: Uint8Array };

export class PublishError extends Error {}

// Принимает "owner/repo", "https://github.com/owner/repo" и "owner/repo.git"
export function parseRepoInput(raw: string): string | null {
  const s = raw
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(s) ? s : null;
}

function ghHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "landing-constructor",
  };
}

async function ghFetch(
  token: string,
  urlPath: string,
  init?: RequestInit,
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API}${urlPath}`, {
      ...init,
      headers: {
        ...ghHeaders(token),
        ...((init?.headers as Record<string, string> | undefined) ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new PublishError(
      "Не удалось связаться с GitHub — у сервера нет доступа в интернет",
    );
  }
  return res;
}

async function apiError(res: Response, fallback: string): Promise<string> {
  try {
    const j = (await res.json()) as { message?: string };
    if (j.message) return `${fallback}: ${j.message}`;
  } catch {
    // тело не JSON — возвращаем fallback
  }
  return fallback;
}

/**
 * Публикует файлы в репозиторий одним коммитом через Git Data API:
 * blobs → tree → commit → обновление ветки. Не требует git в системе.
 */
export async function publishToGitHub(
  files: GitHubFile[],
  opts: { repo: string; token: string; branch?: string; message: string },
): Promise<{ commitSha: string; branch: string }> {
  const { repo, token } = opts;

  const repoRes = await ghFetch(token, `/repos/${repo}`);
  if (repoRes.status === 401) {
    throw new PublishError("Токен GitHub недействителен или истёк — создайте новый");
  }
  if (repoRes.status === 404) {
    throw new PublishError(
      `Репозиторий ${repo} не найден (или токену не выдан к нему доступ)`,
    );
  }
  if (!repoRes.ok) {
    throw new PublishError(await apiError(repoRes, `GitHub вернул ошибку ${repoRes.status}`));
  }
  const repoInfo = (await repoRes.json()) as {
    default_branch?: string;
    permissions?: { push?: boolean };
  };
  if (repoInfo.permissions?.push === false) {
    throw new PublishError(
      "Токену не выдано право записи в репозиторий (нужно Contents: Read and write)",
    );
  }
  const branch = opts.branch || repoInfo.default_branch || "main";

  const refRes = await ghFetch(token, `/repos/${repo}/git/ref/heads/${branch}`);
  if (refRes.status === 404) {
    throw new PublishError(
      `Ветка ${branch} не найдена — репозиторий пустой. Сделайте на GitHub первый коммит (например, добавьте README)`,
    );
  }
  if (!refRes.ok) {
    throw new PublishError(await apiError(refRes, `Не удалось получить ветку ${branch}`));
  }
  const ref = (await refRes.json()) as { object: { sha: string } };
  const baseSha = ref.object.sha;

  const commitRes = await ghFetch(token, `/repos/${repo}/git/commits/${baseSha}`);
  if (!commitRes.ok) {
    throw new PublishError(await apiError(commitRes, "Не удалось получить текущий коммит"));
  }
  const commitInfo = (await commitRes.json()) as { tree: { sha: string } };
  const baseTree = commitInfo.tree.sha;

  // Blob-ы грузим параллельно небольшими пачками
  const tree: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
  const CHUNK = 8;
  for (let i = 0; i < files.length; i += CHUNK) {
    const batch = files.slice(i, i + CHUNK);
    const shas = await Promise.all(
      batch.map(async (f) => {
        const blobRes = await ghFetch(token, `/repos/${repo}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({
            content: Buffer.from(f.data).toString("base64"),
            encoding: "base64",
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (!blobRes.ok) {
          throw new PublishError(
            await apiError(blobRes, `Не удалось загрузить файл ${f.path}`),
          );
        }
        const blob = (await blobRes.json()) as { sha: string };
        return { path: f.path, sha: blob.sha };
      }),
    );
    tree.push(
      ...shas.map((s) => ({ path: s.path, mode: "100644" as const, type: "blob" as const, sha: s.sha })),
    );
  }

  const treeRes = await ghFetch(token, `/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
    headers: { "Content-Type": "application/json" },
  });
  if (!treeRes.ok) {
    throw new PublishError(await apiError(treeRes, "Не удалось создать дерево файлов"));
  }
  const newTree = (await treeRes.json()) as { sha: string };

  const newCommitRes = await ghFetch(token, `/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: opts.message,
      tree: newTree.sha,
      parents: [baseSha],
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (!newCommitRes.ok) {
    throw new PublishError(await apiError(newCommitRes, "Не удалось создать коммит"));
  }
  const newCommit = (await newCommitRes.json()) as { sha: string };

  const refPatchRes = await ghFetch(token, `/repos/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
    headers: { "Content-Type": "application/json" },
  });
  if (!refPatchRes.ok) {
    throw new PublishError(
      await apiError(refPatchRes, `Не удалось обновить ветку ${branch}`),
    );
  }

  return { commitSha: newCommit.sha, branch };
}
