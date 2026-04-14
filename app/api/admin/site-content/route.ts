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

  await writeSiteContentAsync(updated);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");

  return NextResponse.json({ ok: true });
}
