import fs from "fs";
import path from "path";
import { projects as staticProjects, type Project, type Category } from "./projects";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(staticProjects, null, 2), "utf-8");
    }
  } catch {
    // 파일시스템 접근 불가 환경에서는 정적 데이터 사용
  }
}

export function readProjects(): Project[] {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // fallback
  }
  return staticProjects;
}

export function writeProjects(projects: Project[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export function getProjectByIdFromData(id: string): Project | undefined {
  return readProjects().find((p) => p.id === id);
}

export function getFeaturedProjectsFromData(): Project[] {
  return readProjects().filter((p) => p.featured);
}

export function getProjectsByCategoryFromData(category: Category): Project[] {
  const all = readProjects();
  if (category === "all") return all;
  return all.filter((p) => p.category === category);
}
