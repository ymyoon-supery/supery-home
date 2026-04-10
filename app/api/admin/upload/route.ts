import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const allowedTypes = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "이미지 또는 동영상 파일만 업로드 가능합니다." }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");

  try {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLD_CLOUD_NAME,
      api_key: process.env.CLD_API_KEY,
      api_secret: process.env.CLD_API_SECRET,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "supery",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: result.secure_url,
      type: isVideo ? "video" : "image",
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
