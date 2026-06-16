import fs from "fs";
import path from "path";
import { defaultSiteContent, type SiteContent } from "./siteContent";

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

// ─── JSONBin.io persistent storage ────────────────────────────────────────
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY ?? "";
const JSONBIN_SITE_BIN_ID = process.env.JSONBIN_SITE_BIN_ID ?? "";
const JSONBIN_BASE = "https://api.jsonbin.io/v3";

// 5분 TTL 메모리 캐시 — 같은 함수 인스턴스 내 반복 API 호출 방지
const CACHE_TTL_MS = 5 * 60 * 1000;
let memCache: { data: SiteContent; at: number } | null = null;

async function readFromJsonBin(): Promise<SiteContent | null> {
  if (!JSONBIN_API_KEY || !JSONBIN_SITE_BIN_ID) return null;
  try {
    const res = await fetch(`${JSONBIN_BASE}/b/${JSONBIN_SITE_BIN_ID}/latest`, {
      headers: { "X-Master-Key": JSONBIN_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.record as SiteContent;
  } catch {
    return null;
  }
}

async function writeToJsonBin(content: SiteContent): Promise<boolean> {
  if (!JSONBIN_API_KEY || !JSONBIN_SITE_BIN_ID) return false;
  try {
    const res = await fetch(`${JSONBIN_BASE}/b/${JSONBIN_SITE_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
      },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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
  // 1. 메모리 캐시 HIT — JSONBin 호출 없이 반환
  if (memCache && Date.now() - memCache.at < CACHE_TTL_MS) {
    return memCache.data;
  }

  // 2. Try JSONBin (persistent, survives deployments)
  if (JSONBIN_API_KEY && JSONBIN_SITE_BIN_ID) {
    const remote = await readFromJsonBin();
    if (remote) {
      const merged = mergeWithDefaults(remote);
      memCache = { data: merged, at: Date.now() };
      writeLocalSiteContent(merged);
      return merged;
    }
  }

  // 3. Fallback to local file
  const local = readLocalSiteContent();
  return local ? mergeWithDefaults(local) : defaultSiteContent;
}

export async function writeSiteContentAsync(content: SiteContent): Promise<void> {
  writeLocalSiteContent(content);
  await writeToJsonBin(content);
  // 쓰기 후 캐시 즉시 갱신 — 다음 읽기가 JSONBin을 다시 치지 않도록
  memCache = { data: content, at: Date.now() };
}
