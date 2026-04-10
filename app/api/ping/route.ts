import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
  });
}
