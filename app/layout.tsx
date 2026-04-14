import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/ui/ThemeProvider";
import ConditionalShell from "@/components/layout/ConditionalShell";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SUPER Y | 마케팅 에이전시",
    template: "%s | SUPER Y",
  },
  description:
    "끊임없이 변화하는 멀티채널 환경에서 브랜드의 가치를 극대화하는 마케팅 해답을 제시합니다. 브랜드의 본질을 깊이 있게 분석해 인사이트를 도출하고, 창의적인 콘텐츠와 소셜 마케팅에 최적화된 커뮤니케이션 솔루션을 제공합니다.",
  keywords: ["SUPER Y", "광고 마케팅", "SNS 마케팅", "캠페인", "인플루언서", "브랜딩", "디지털 마케팅"],
  authors: [{ name: "SUPER Y" }],
  creator: "SUPER Y",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.supery.co.kr",
    siteName: "SUPER Y",
    title: "SUPER Y | 마케팅 에이전시",
    description: "끊임없이 변화하는 멀티채널 환경에서 브랜드의 가치를 극대화하는 마케팅 해답을 제시합니다.",
    images: [
      {
        url: "https://cdn.imweb.me/thumbnail/20260225/b46c0438a299b.png",
        width: 1200,
        height: 630,
        alt: "SUPER Y",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SUPER Y | 마케팅 에이전시",
    description: "끊임없이 변화하는 멀티채널 환경에서 브랜드의 가치를 극대화하는 마케팅 해답을 제시합니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={notoSansKR.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg-main)] text-[var(--text-heading)]">
        <ThemeProvider>
          <ConditionalShell header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
