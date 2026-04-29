import { NextResponse } from "next/server";
import { readHeroIdsAsync, readProjectsAsync } from "@/lib/data";

export async function GET() {
  const [heroIds, projects] = await Promise.all([readHeroIdsAsync(), readProjectsAsync()]);
  const heroProjects = projects.filter((p) => p.inHero);
  return NextResponse.json({
    heroIds,
    heroCount: heroIds.length,
    mergedHeroCount: heroProjects.length,
    heroProjects: heroProjects.map((p) => ({ id: p.id, title: p.title })),
  });
}
