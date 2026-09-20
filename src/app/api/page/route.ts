import { NextResponse } from "next/server";
import { readPage, writePage } from "@/lib/page-store";
import type { PageDoc } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readPage());
}

export async function PUT(request: Request) {
  let body: PageDoc;
  try {
    body = (await request.json()) as PageDoc;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
  if (
    !body ||
    !Array.isArray(body.blocks) ||
    !body.settings ||
    typeof body.settings !== "object"
  ) {
    return NextResponse.json({ error: "Некорректный формат" }, { status: 400 });
  }
  await writePage(body);
  return NextResponse.json({ ok: true });
}
