import { NextResponse } from "next/server";
import { defaultSiteContent } from "@/lib/siteContent";

/**
 * GET /api/admin/init-jsonbin-site
 * JSONBin에 사이트 콘텐츠용 새 Bin을 생성합니다.
 * 최초 1회만 실행. 반환된 BIN_ID를 Vercel 환경변수 JSONBIN_SITE_BIN_ID에 설정하세요.
 */
export async function GET() {
  const apiKey = process.env.JSONBIN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "JSONBIN_API_KEY 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.jsonbin.io/v3/b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
      "X-Bin-Name": "supery-site-content",
      "X-Bin-Private": "true",
    },
    body: JSON.stringify(defaultSiteContent),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  const binId: string = data.metadata?.id ?? "";

  return NextResponse.json({
    message: "Bin 생성 완료! 아래 JSONBIN_SITE_BIN_ID를 Vercel 환경변수에 추가하세요.",
    JSONBIN_SITE_BIN_ID: binId,
  });
}
