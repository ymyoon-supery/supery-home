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

// ─── Public API ────────────────────────────────────────────────────────────
export async function readSiteContentAsync(): Promise<SiteContent> {
  // 1. Try JSONBin (persistent, survives deployments)
  if (JSONBIN_API_KEY && JSONBIN_SITE_BIN_ID) {
    const remote = await readFromJsonBin();
    if (remote) {
      writeLocalSiteContent(remote); // cache locally
      return remote;
    }
  }
  // 2. Fallback to local file
  const local = readLocalSiteContent();
  return local ?? defaultSiteContent;
}

export async function writeSiteContentAsync(content: SiteContent): Promise<void> {
  writeLocalSiteContent(content);
  await writeToJsonBin(content);
}
