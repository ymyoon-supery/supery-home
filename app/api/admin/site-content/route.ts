import { NextRequest, NextResponse } from "next/server";
import { readSiteContentAsync, writeSiteContentAsync } from "@/lib/siteData";
import { revalidatePath } from "next/cache";

export async function GET() {
  const content = await readSiteContentAsync();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const current = await readSiteContentAsync();
  const updated = { ...current, ...body };

  const ok = await writeSiteContentAsync(updated);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");

  if (!ok) {
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
