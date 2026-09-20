import fs from "node:fs/promises";
import path from "node:path";
import { defaultPageDoc } from "./default-page";
import type { PageDoc } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "page.json");

export async function readPage(): Promise<PageDoc> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as PageDoc;
    if (!parsed || !Array.isArray(parsed.blocks) || !parsed.settings) {
      throw new Error("bad doc");
    }
    return parsed;
  } catch {
    await writePage(defaultPageDoc);
    return defaultPageDoc;
  }
}

export async function writePage(doc: PageDoc): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(doc, null, 2), "utf8");
}
