import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import { projects as staticProjects, type Project, type Category } from "./projects";

// ─── Local file cache ──────────────────────────────────────────────────────
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

// ─── Vercel Blob (primary storage) ────────────────────────────────────────
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";
const BLOB_PATHNAME = "supery-projects.json";

async function readFromBlob(): Promise<Project[] | null> {
  if (!BLOB_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token: BLOB_TOKEN });
    const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function writeToBlob(projects: Project[]): Promise<{ ok: boolean; error?: string }> {
  if (!BLOB_TOKEN) return { ok: false, error: "BLOB_READ_WRITE_TOKEN 환경변수 없음" };
  try {
    await put(BLOB_PATHNAME, JSON.stringify(projects), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: BLOB_TOKEN,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── JSONBin (legacy — migration only) ────────────────────────────────────
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY ?? "";
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID ?? "";

async function readFromJsonBin(): Promise<Project[] | null> {
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) return null;
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
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

// ─── Public API ────────────────────────────────────────────────────────────
export function readProjects(): Project[] {
  const local = readLocalProjects();
  return local ?? staticProjects;
}

export async function readProjectsAsync(): Promise<Project[]> {
  // 1. Try Vercel Blob (primary)
  if (BLOB_TOKEN) {
    const blob = await readFromBlob();
    if (blob) {
      writeLocalProjects(blob);
      return blob;
    }
    // Blob empty → auto-migrate from JSONBin
    const legacy = await readFromJsonBin();
    if (legacy) {
      await writeToBlob(legacy);
      writeLocalProjects(legacy);
      return legacy;
    }
  }
  // 2. Fallback: local file → static
  return readLocalProjects() ?? staticProjects;
}

export async function writeProjectsAsync(projects: Project[]): Promise<{ ok: boolean; error?: string }> {
  writeLocalProjects(projects);
  const result = await writeToBlob(projects);
  if (!result.ok) return { ok: false, error: `Vercel Blob 저장 실패: ${result.error}` };
  return { ok: true };
}

// Sync shim for legacy callers
export function writeProjects(projects: Project[]): void {
  writeLocalProjects(projects);
  writeToBlob(projects).catch(() => {});
}

export async function getProjectByIdFromData(id: string): Promise<Project | undefined> {
  return (await readProjectsAsync()).find((p) => p.id === id);
}

export async function getFeaturedProjectsFromData(): Promise<Project[]> {
  return (await readProjectsAsync()).filter((p) => p.featured);
}

export async function getProjectsByCategoryFromData(category: Category): Promise<Project[]> {
  const all = await readProjectsAsync();
  if (category === "all") return all;
  return all.filter((p) => p.category === category);
}
