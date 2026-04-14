import type { Metadata } from "next";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = { title: "SUPER Y Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5F3] overflow-auto flex flex-col">
      <AdminHeader />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
