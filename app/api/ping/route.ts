import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    CLD_CLOUD_NAME: process.env.CLD_CLOUD_NAME ? "SET" : "MISSING",
    CLD_API_KEY: process.env.CLD_API_KEY ? "SET" : "MISSING",
    CLD_API_SECRET: process.env.CLD_API_SECRET ? "SET" : "MISSING",
  });
}
