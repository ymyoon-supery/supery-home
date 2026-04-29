import { NextRequest, NextResponse } from "next/server";
import { readProjectsAsync, writeProjectsAsync } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { categoryLabels, type Category } from "@/lib/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const projects = await readProjectsAsync();
  const project = projects.find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const { title, category, description, image, heroImage, media, featured } = body;

  const projects = await readProjectsAsync();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  projects[index] = {
    ...projects[index],
    title,
    category: category as Exclude<Category, "all">,
    categoryLabel: categoryLabels[category as Category] ?? category,
    description: description ?? "",
    image,
    heroImage: heroImage ?? undefined,
    media: media ?? [],
    featured: Boolean(featured),
  };

  const result = await writeProjectsAsync(projects);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath(`/project/${id}`);

  return NextResponse.json(projects[index]);
}

export async function PATCH(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const projects = await readProjectsAsync();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const heroCount = projects.filter((p) => p.inHero).length;
  const currentlyInHero = projects[index].inHero ?? false;

  if (!currentlyInHero && heroCount >= 5) {
    return NextResponse.json({ error: "Hero 슬라이더는 최대 5개까지 선택할 수 있습니다." }, { status: 400 });
  }

  projects[index] = { ...projects[index], inHero: !currentlyInHero };

  const result = await writeProjectsAsync(projects);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");

  return NextResponse.json({ inHero: projects[index].inHero });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const projects = await readProjectsAsync();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await writeProjectsAsync(filtered);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/project");

  return NextResponse.json({ success: true });
}
