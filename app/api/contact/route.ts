import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, inquiryType, message } = await req.json();

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SUPER Y 문의" <${process.env.SMTP_USER}>`,
      to: "ymyoon@supery.co.kr",
      replyTo: email,
      subject: `[SUPER Y 문의] ${inquiryType} - ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafaf8; border-radius: 12px;">
          <h2 style="color: #1a1a1a; margin-bottom: 24px; font-size: 20px;">새 문의가 접수되었습니다</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #777; font-size: 13px; width: 100px; vertical-align: top;">이름</td>
              <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777; font-size: 13px; vertical-align: top;">이메일</td>
              <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;"><a href="mailto:${email}" style="color: #1a1a1a;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777; font-size: 13px; vertical-align: top;">회사명</td>
              <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${company || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777; font-size: 13px; vertical-align: top;">문의 유형</td>
              <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${inquiryType}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e0e0dc; margin: 20px 0;" />
          <h3 style="color: #777; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">메시지</h3>
          <p style="color: #1a1a1a; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e0e0dc; margin: 32px 0 20px;" />
          <p style="color: #aaa; font-size: 12px;">SUPER Y 웹사이트 문의 폼에서 전송된 메일입니다.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail send error:", error);
    return NextResponse.json({ error: "이메일 전송에 실패했습니다." }, { status: 500 });
  }
}
