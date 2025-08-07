// app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0E1423] text-white overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with fixed height */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Main content scrolls if needed */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#0f172a]">
          <DashboardClientWrapper>{children}</DashboardClientWrapper>
        </main>
      </div>
    </div>
  );
}
