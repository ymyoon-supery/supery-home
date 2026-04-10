import { NextRequest, NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { categoryLabels, type Category } from "@/lib/projects";

export async function GET() {
  return NextResponse.json(readProjects());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, category, description, image, media, featured } = body;

  if (!title || !category || !image) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const projects = readProjects();
  const newProject = {
    id: crypto.randomUUID(),
    title,
    category: category as Exclude<Category, "all">,
    categoryLabel: categoryLabels[category as Category] ?? category,
    image,
    media: media ?? [],
    description: description ?? "",
    featured: Boolean(featured),
  };

  writeProjects([...projects, newProject]);
  revalidatePath("/");
  revalidatePath("/project");

  return NextResponse.json(newProject, { status: 201 });
}
