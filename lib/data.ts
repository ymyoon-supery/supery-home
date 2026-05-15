import { supabase } from "./supabase";
import { projects as staticProjects, type Project, type Category } from "./projects";

// ─── Row ↔ Project mapping ─────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category as Exclude<Category, "all">,
    categoryLabel: row.category_label,
    description: row.description ?? "",
    image: row.image,
    imageMobile: row.image_mobile ?? undefined,
    heroImage: row.hero_image ?? undefined,
    heroImageMobile: row.hero_image_mobile ?? undefined,
    inHero: row.in_hero ?? false,
    media: row.media ?? [],
    featured: row.featured ?? false,
  };
}

function projectToRow(p: Project) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    category_label: p.categoryLabel,
    description: p.description ?? "",
    image: p.image,
    image_mobile: p.imageMobile ?? null,
    hero_image: p.heroImage ?? null,
    hero_image_mobile: p.heroImageMobile ?? null,
    in_hero: p.inHero ?? false,
    media: p.media ?? [],
    featured: p.featured ?? false,
  };
}

// ─── Check if Supabase is configured ──────────────────────────────────────
function hasSupabase(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ─── Public API ────────────────────────────────────────────────────────────
export async function readProjectsAsync(): Promise<Project[]> {
  if (!hasSupabase()) return staticProjects;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return staticProjects;
    return data.map(rowToProject);
  } catch {
    return staticProjects;
  }
}

export async function writeProjectsAsync(projects: Project[]): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase()) return { ok: false, error: "Supabase 환경변수 없음" };
  try {
    const rows = projects.map(projectToRow);
    // upsert all — replaces entire dataset
    const { error } = await supabase.from("projects").upsert(rows, { onConflict: "id" });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function insertProject(project: Project): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase()) return { ok: false, error: "Supabase 환경변수 없음" };
  try {
    const { error } = await supabase.from("projects").insert({ ...projectToRow(project), position: 0 });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase()) return { ok: false, error: "Supabase 환경변수 없음" };
  try {
    // Build only the changed columns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: Record<string, any> = {};
    if (patch.title !== undefined) row.title = patch.title;
    if (patch.category !== undefined) row.category = patch.category;
    if (patch.categoryLabel !== undefined) row.category_label = patch.categoryLabel;
    if (patch.description !== undefined) row.description = patch.description;
    if (patch.image !== undefined) row.image = patch.image;
    if ('imageMobile' in patch) row.image_mobile = patch.imageMobile ?? null;
    if ('heroImage' in patch) row.hero_image = patch.heroImage ?? null;
    if ('heroImageMobile' in patch) row.hero_image_mobile = patch.heroImageMobile ?? null;
    if (patch.inHero !== undefined) row.in_hero = patch.inHero;
    if (patch.media !== undefined) row.media = patch.media;
    if (patch.featured !== undefined) row.featured = patch.featured;

    const { error } = await supabase.from("projects").update(row).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function deleteProject(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase()) return { ok: false, error: "Supabase 환경변수 없음" };
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function getProjectByIdFromData(id: string): Promise<Project | undefined> {
  if (!hasSupabase()) return staticProjects.find((p) => p.id === id);
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error || !data) return undefined;
    return rowToProject(data);
  } catch {
    return undefined;
  }
}

export async function getHeroProjectsFromData(): Promise<Project[]> {
  if (!hasSupabase()) return [];
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("in_hero", true)
      .order("hero_order", { ascending: true, nullsFirst: false });
    if (error || !data) return [];
    return data.map(rowToProject);
  } catch {
    return [];
  }
}

export async function getFeaturedProjectsFromData(): Promise<Project[]> {
  if (!hasSupabase()) return staticProjects.filter((p) => p.featured);
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("featured", true);
    if (error || !data) return [];
    return data.map(rowToProject);
  } catch {
    return [];
  }
}

export async function getProjectsByCategoryFromData(category: Category): Promise<Project[]> {
  if (!hasSupabase()) {
    return category === "all" ? staticProjects : staticProjects.filter((p) => p.category === category);
  }
  try {
    let query = supabase.from("projects").select("*");
    if (category !== "all") query = query.eq("category", category);
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(rowToProject);
  } catch {
    return [];
  }
}

// Legacy shims
export function readProjects(): Project[] { return staticProjects; }
export function writeProjects(_projects: Project[]): void { /* no-op */ }
