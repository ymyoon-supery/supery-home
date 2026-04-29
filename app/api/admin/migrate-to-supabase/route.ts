import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { supabase } from "@/lib/supabase";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";
const BLOB_PATHNAME = "supery-projects.json";

export async function POST() {
  try {
    // 1. Read current data from Vercel Blob
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token: BLOB_TOKEN });
    const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    if (!blob) {
      return NextResponse.json({ error: "Vercel Blob에서 데이터를 찾을 수 없습니다." }, { status: 404 });
    }

    const res = await fetch(`${blob.url}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Blob 읽기 실패" }, { status: 500 });
    }

    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: "마이그레이션할 데이터가 없습니다." }, { status: 400 });
    }

    // 2. Map to Supabase row format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = projects.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      category_label: p.categoryLabel,
      description: p.description ?? "",
      image: p.image,
      hero_image: p.heroImage ?? null,
      in_hero: p.inHero ?? false,
      media: p.media ?? [],
      featured: p.featured ?? false,
    }));

    // 3. Upsert into Supabase (safe to run multiple times)
    const { error } = await supabase
      .from("projects")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      migrated: rows.length,
      message: `${rows.length}개 프로젝트를 Supabase로 마이그레이션했습니다.`,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
