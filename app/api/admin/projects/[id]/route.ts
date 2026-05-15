import { NextRequest, NextResponse } from "next/server";
import { getProjectByIdFromData, updateProject, deleteProject } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { categoryLabels, type Category } from "@/lib/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const project = await getProjectByIdFromData(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const { title, category, description, image, imageMobile, heroImage, heroImageMobile, media, featured } = body;

  const result = await updateProject(id, {
    title,
    category: category as Exclude<Category, "all">,
    categoryLabel: categoryLabels[category as Category] ?? category,
    description: description ?? "",
    image,
    imageMobile: imageMobile || undefined,
    heroImage: heroImage || undefined,
    heroImageMobile: heroImageMobile || undefined,
    media: media ?? [],
    featured: Boolean(featured),
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath(`/project/${id}`);

  const updated = await getProjectByIdFromData(id);
  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const newInHero = Boolean(body.inHero);

  // Check hero count limit (max 5)
  if (newInHero) {
    const { readProjectsAsync } = await import("@/lib/data");
    const projects = await readProjectsAsync();
    const heroCount = projects.filter((p) => p.inHero && p.id !== id).length;
    if (heroCount >= 5) {
      return NextResponse.json({ error: "Hero 슬라이더는 최대 5개까지 선택할 수 있습니다." }, { status: 400 });
    }
  }

  if (newInHero) {
    // Get next hero_order (max + 1)
    const { supabase } = await import("@/lib/supabase");
    const { data } = await supabase
      .from("projects")
      .select("hero_order")
      .eq("in_hero", true)
      .order("hero_order", { ascending: false })
      .limit(1);
    const nextOrder = data && data[0]?.hero_order != null ? data[0].hero_order + 1 : 1;
    const { error } = await supabase.from("projects").update({ in_hero: true, hero_order: nextOrder }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.from("projects").update({ in_hero: false, hero_order: null }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  return NextResponse.json({ inHero: newInHero });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const result = await deleteProject(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/project");
  return NextResponse.json({ success: true });
}
