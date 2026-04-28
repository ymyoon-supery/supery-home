import fs from "fs";
import path from "path";
import { projects as staticProjects, type Project, type Category } from "./projects";

// ─── Local file fallback ───────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(staticProjects, null, 2), "utf-8");
    }
  } catch {
    // read-only filesystem — ignore
  }
}

function readLocalProjects(): Project[] | null {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
}

function writeLocalProjects(projects: Project[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch {
    // ignore on ephemeral filesystem
  }
}

// ─── JSONBin.io persistent storage ────────────────────────────────────────
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY ?? "";
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID ?? "";
const JSONBIN_BASE = "https://api.jsonbin.io/v3";

async function readFromJsonBin(): Promise<Project[] | null> {
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) return null;
  try {
    const res = await fetch(`${JSONBIN_BASE}/b/${JSONBIN_BIN_ID}/latest`, {
      headers: { "X-Master-Key": JSONBIN_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.record as Project[];
  } catch {
    return null;
  }
}

async function writeToJsonBin(projects: Project[]): Promise<boolean> {
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) return false;
  try {
    const res = await fetch(`${JSONBIN_BASE}/b/${JSONBIN_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
      },
      body: JSON.stringify(projects),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────
// readProjects: sync for build-time (generateStaticParams), async for runtime
export function readProjects(): Project[] {
  const local = readLocalProjects();
  return local ?? staticProjects;
}

export async function readProjectsAsync(): Promise<Project[]> {
  // 1. Try JSONBin (persistent, survives deployments)
  if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
    const remote = await readFromJsonBin();
    if (remote) {
      writeLocalProjects(remote); // cache locally
      return remote;
    }
  }
  // 2. Fallback to local file
  const local = readLocalProjects();
  return local ?? staticProjects;
}

export async function writeProjectsAsync(projects: Project[]): Promise<{ ok: boolean; error?: string }> {
  // Always write locally first (fast)
  writeLocalProjects(projects);
  // Then persist to JSONBin
  if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
    const ok = await writeToJsonBin(projects);
    if (!ok) return { ok: false, error: "JSONBin 저장 실패 (bin 용량 초과 또는 API 오류)" };
  }
  return { ok: true };
}

// Sync shim for legacy callers — prefer Async variants in API routes
export function writeProjects(projects: Project[]): void {
  writeLocalProjects(projects);
  // Fire-and-forget to JSONBin
  writeToJsonBin(projects).catch(() => {});
}

export async function getProjectByIdFromData(id: string): Promise<Project | undefined> {
  const projects = await readProjectsAsync();
  return projects.find((p) => p.id === id);
}

export async function getFeaturedProjectsFromData(): Promise<Project[]> {
  return (await readProjectsAsync()).filter((p) => p.featured);
}

export async function getProjectsByCategoryFromData(category: Category): Promise<Project[]> {
  const all = await readProjectsAsync();
  if (category === "all") return all;
  return all.filter((p) => p.category === category);
}
