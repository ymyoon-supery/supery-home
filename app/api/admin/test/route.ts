import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "SET" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
