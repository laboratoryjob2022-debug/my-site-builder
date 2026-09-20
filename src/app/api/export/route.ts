import { readPage } from "@/lib/page-store";
import { buildSiteFiles } from "@/lib/export/build-site";
import { createZip, type ZipEntry } from "@/lib/export/zip";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const doc = await readPage();
  const entries: ZipEntry[] = await buildSiteFiles(doc);
  const zip = new Uint8Array(createZip(entries));

  return new Response(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="landing.zip"',
      "Cache-Control": "no-store",
    },
  });
}

export function POST() {
  return NextResponse.json({ error: "Метод не поддерживается" }, { status: 405 });
}
