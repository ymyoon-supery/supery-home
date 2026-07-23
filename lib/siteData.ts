import fs from "fs";
import path from "path";
import { defaultSiteContent, type SiteContent } from "./siteContent";
import { getSupabase } from "./supabase";

// ─── Local file fallback ───────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const SITE_FILE = path.join(DATA_DIR, "site-content.json");

function ensureSiteFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(SITE_FILE)) {
      fs.writeFileSync(SITE_FILE, JSON.stringify(defaultSiteContent, null, 2), "utf-8");
    }
  } catch {
    // read-only filesystem — ignore
  }
}

function readLocalSiteContent(): SiteContent | null {
  try {
    ensureSiteFile();
    if (fs.existsSync(SITE_FILE)) {
      return JSON.parse(fs.readFileSync(SITE_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
}

function writeLocalSiteContent(content: SiteContent): void {
  try {
    ensureSiteFile();
    fs.writeFileSync(SITE_FILE, JSON.stringify(content, null, 2), "utf-8");
  } catch {
    // ignore on ephemeral filesystem
  }
}

// ─── Supabase persistent storage ──────────────────────────────────────────
async function readFromSupabase(): Promise<SiteContent | null> {
  try {
    const { data, error } = await getSupabase()
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return data.data as SiteContent;
  } catch {
    return null;
  }
}

async function writeToSupabase(content: SiteContent): Promise<boolean> {
  try {
    const { error } = await getSupabase()
      .from("site_content")
      .upsert(
        { id: 1, data: content, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
    return !error;
  } catch {
    return false;
  }
}

// ─── 5분 TTL 메모리 캐시 ───────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000;
let memCache: { data: SiteContent; at: number } | null = null;

// 저장된 데이터에 새 필드가 없을 때 기본값으로 채워주는 딥 머지
function mergeWithDefaults(saved: Partial<SiteContent>): SiteContent {
  return {
    services: { ...defaultSiteContent.services, ...saved.services },
    about: { ...defaultSiteContent.about, ...saved.about },
    contact: { ...defaultSiteContent.contact, ...saved.contact },
    footer: { ...defaultSiteContent.footer, ...saved.footer },
  };
}

// ─── Public API ────────────────────────────────────────────────────────────
export async function readSiteContentAsync(): Promise<SiteContent> {
  // 1. 메모리 캐시 HIT
  if (memCache && Date.now() - memCache.at < CACHE_TTL_MS) {
    return memCache.data;
  }

  // 2. Supabase (persistent, survives deployments)
  const remote = await readFromSupabase();
  if (remote) {
    const merged = mergeWithDefaults(remote);
    memCache = { data: merged, at: Date.now() };
    writeLocalSiteContent(merged);
    return merged;
  }

  // 3. Fallback: local file
  const local = readLocalSiteContent();
  return local ? mergeWithDefaults(local) : defaultSiteContent;
}

export async function writeSiteContentAsync(content: SiteContent): Promise<boolean> {
  writeLocalSiteContent(content);
  const ok = await writeToSupabase(content);
  if (!ok) return false;
  memCache = { data: content, at: Date.now() };
  return true;
}
