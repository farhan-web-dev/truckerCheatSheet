// app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 bg-[#0f172a] overflow-auto">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
      </div>
    </div>
  );
}
