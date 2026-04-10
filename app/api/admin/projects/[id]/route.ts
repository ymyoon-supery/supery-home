import { NextRequest, NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { categoryLabels, type Category } from "@/lib/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const project = readProjects().find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const { title, category, description, image, media, featured } = body;

  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  projects[index] = {
    ...projects[index],
    title,
    category: category as Exclude<Category, "all">,
    categoryLabel: categoryLabels[category as Category] ?? category,
    description: description ?? "",
    image,
    media: media ?? [],
    featured: Boolean(featured),
  };

  writeProjects(projects);
  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath(`/project/${id}`);

  return NextResponse.json(projects[index]);
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const projects = readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  writeProjects(filtered);
  revalidatePath("/");
  revalidatePath("/project");

  return NextResponse.json({ success: true });
}
