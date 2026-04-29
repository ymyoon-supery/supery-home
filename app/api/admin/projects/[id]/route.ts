import { NextRequest, NextResponse } from "next/server";
import { readProjectsAsync, writeProjectsAsync, readHeroIdsAsync, writeHeroIdsAsync } from "@/lib/data";
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

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const newInHero = Boolean(body.inHero);

  // Read only the hero IDs file — avoids race condition with full projects blob
  const heroIds = await readHeroIdsAsync();
  const alreadyInHero = heroIds.includes(id);

  if (newInHero && !alreadyInHero) {
    if (heroIds.length >= 5) {
      return NextResponse.json({ error: "Hero 슬라이더는 최대 5개까지 선택할 수 있습니다." }, { status: 400 });
    }
    const updated = [...heroIds, id];
    const result = await writeHeroIdsAsync(updated);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  } else if (!newInHero && alreadyInHero) {
    const updated = heroIds.filter((hid) => hid !== id);
    const result = await writeHeroIdsAsync(updated);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  }

  revalidatePath("/");
  return NextResponse.json({ inHero: newInHero });
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const [projects, heroIds] = await Promise.all([readProjectsAsync(), readHeroIdsAsync()]);
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const writes: Promise<unknown>[] = [writeProjectsAsync(filtered)];
  if (heroIds.includes(id)) {
    writes.push(writeHeroIdsAsync(heroIds.filter((hid) => hid !== id)));
  }
  const [result] = await Promise.all(writes) as [{ ok: boolean; error?: string }];
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/project");

  return NextResponse.json({ success: true });
}
