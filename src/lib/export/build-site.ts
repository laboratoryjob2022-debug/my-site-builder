import fs from "node:fs/promises";
import path from "node:path";
import type { Block, PageDoc } from "@/lib/types";
import { renderExportHtml, renderReadme } from "./export-html";
import type { ZipEntry } from "./zip";

function collectLocalPaths(doc: PageDoc): string[] {
  const paths = new Set<string>();
  const add = (p: string | undefined | null) => {
    if (p && p.startsWith("/") && !p.startsWith("//")) paths.add(p);
  };
  for (const block of doc.blocks) {
    const b = block as Block;
    if (b.type === "hero") add(b.image);
    if (b.type === "audio") {
      add(b.cover);
      add(b.src);
    }
    if (b.type === "video") add(b.url);
    if (b.type === "releases") b.items.forEach((it) => add(it.cover));
    if (b.type === "gallery") b.images.forEach(add);
    add(b.design?.bgImage);
  }
  return [...paths];
}

// Собирает готовый статический сайт: index.html + README + ассеты из public/
export async function buildSiteFiles(doc: PageDoc): Promise<ZipEntry[]> {
  const html = renderExportHtml(doc);

  // Локальные файлы (/uploads/..., /demo/...) кладём рядом и переписываем ссылки
  const assets: ZipEntry[] = [];
  let out = html;
  for (const p of collectLocalPaths(doc)) {
    try {
      const file = await fs.readFile(path.join(process.cwd(), "public", p));
      const data = new Uint8Array(file);
      assets.push({ name: `assets${p}`, data });
      out = out.split(`"${p}"`).join(`"assets${p}"`);
    } catch {
      // файла нет на диске — оставляем ссылку как есть
    }
  }

  return [
    { name: "index.html", data: new TextEncoder().encode(out) },
    { name: "README.txt", data: new TextEncoder().encode(renderReadme(doc)) },
    ...assets,
  ];
}
