import { NextResponse } from "next/server";
import { readProjects } from "@/lib/data";

/**
 * POST /api/admin/init-jsonbin
 * JSONBin에 새 Bin을 생성하고 현재 프로젝트 데이터를 초기값으로 저장합니다.
 * 최초 1회만 실행하면 됩니다. 반환된 BIN_ID를 Railway 환경변수 JSONBIN_BIN_ID에 설정하세요.
 */
export async function GET() {
  const apiKey = process.env.JSONBIN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "JSONBIN_API_KEY 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const projects = readProjects();

  const res = await fetch("https://api.jsonbin.io/v3/b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
      "X-Bin-Name": "supery-projects",
      "X-Bin-Private": "true",
    },
    body: JSON.stringify(projects),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  const binId: string = data.metadata?.id ?? "";

  return NextResponse.json({
    message: "Bin 생성 완료! 아래 BIN_ID를 Railway 환경변수 JSONBIN_BIN_ID에 설정하세요.",
    JSONBIN_BIN_ID: binId,
    projectCount: projects.length,
  });
}
