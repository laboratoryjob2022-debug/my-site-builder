import { readPage } from "@/lib/page-store";
import { buildSiteFiles } from "@/lib/export/build-site";
import {
  PublishError,
  parseRepoInput,
  publishToGitHub,
  type GitHubFile,
} from "@/lib/github";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getConfig() {
  const token = process.env.GITHUB_TOKEN ?? "";
  const repo = parseRepoInput(process.env.GITHUB_REPO ?? "");
  const branch = (process.env.GITHUB_BRANCH ?? "").trim();
  return { token, repo, branch: branch || null };
}

// Состояние настройки публикации для диалога
export async function GET() {
  const { token, repo, branch } = getConfig();
  return NextResponse.json({
    configured: Boolean(token && repo),
    repo,
    branch,
  });
}

export async function POST() {
  const { token, repo, branch } = getConfig();
  if (!token || !repo) {
    return NextResponse.json(
      {
        error:
          "Публикация не настроена: добавьте переменные окружения GITHUB_TOKEN и GITHUB_REPO",
      },
      { status: 400 },
    );
  }

  const doc = await readPage();
  const siteFiles = await buildSiteFiles(doc);

  const files: GitHubFile[] = siteFiles.map((f) => ({ path: f.name, data: f.data }));
  // GitHub Pages: не запускать Jekyll
  files.push({ path: ".nojekyll", data: new Uint8Array() });

  const domain = doc.settings.customDomain?.trim().replace(/\/+$/, "");
  if (domain) {
    files.push({ path: "CNAME", data: new TextEncoder().encode(domain) });
  }

  try {
    const result = await publishToGitHub(files, {
      repo,
      token,
      branch: branch ?? undefined,
      message: `Обновление лендинга из конструктора — ${new Date().toLocaleString("ru-RU")}`,
    });

    const [owner, name] = repo.split("/");
    const isUserSite = name.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    const pagesUrl = domain
      ? `https://${domain}`
      : isUserSite
        ? `https://${owner}.github.io/`
        : `https://${owner}.github.io/${name}/`;

    return NextResponse.json({
      ok: true,
      url: pagesUrl,
      commit: result.commitSha,
      branch: result.branch,
      files: files.length,
      domain: domain || null,
    });
  } catch (e) {
    const message =
      e instanceof PublishError
        ? e.message
        : "Публикация не удалась — попробуйте ещё раз";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
