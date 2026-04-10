import type { Metadata } from "next";

export const metadata: Metadata = { title: "SUPER Y Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {children}
    </div>
  );
}
