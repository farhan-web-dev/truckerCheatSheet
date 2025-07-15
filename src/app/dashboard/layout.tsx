// app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0E1423] text-white">
      {/* Static Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Static Top Header */}
        <Header />

        {/* Main content with scroll */}
        <main className="relative flex-1 overflow-y-auto p-4 bg-[#0f172a]">
          {/* Only content-area spinner */}
          <RouteLoadingSpinner />

          {/* React Query context and page content */}
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
      </div>
    </div>
  );
}
