"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0E1423] text-white overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="shrink-0">
          <Header setMobileOpen={setMobileOpen} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 bg-[#0f172a]">
          <DashboardClientWrapper>{children}</DashboardClientWrapper>
        </main>
      </div>
    </div>
  );
}
