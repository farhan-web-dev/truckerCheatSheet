// Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Bell, MessageSquare, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import SetupQuickViewModal from "./SetupQuickVeiwModal";

const routeToTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/gps-tracker": "GPS Tracker",
  "/dashboard/driver-management": "Driver Management",
  "/dashboard/quick-view": "Quick View",
  "/dashboard/chat": "Driver Chat",
  "/dashboard/assets": "Fleet Assets Management",
  "/dashboard/documents": "Document Management",
  "/dashboard/nearby-services": "Nearby Services Directory",
  "/dashboard/promo-referral": "Promo & Referral Control",
  "/dashboard/bol-generator": "BOL Generator",
  "/dashboard/admin-settings": "Admin Settings",
};

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = routeToTitleMap[pathname] || "Fleet Management";

  return (
    <>
      <header className="bg-[#0E1423] text-white flex items-center justify-between px-6 py-4">
        {/* Left side: Title */}
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-gray-400">Fleet Management Dashboard</p>
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#2B3448] hover:bg-[#3A4358] text-white px-4 py-2 rounded-md">
            <ArrowLeft size={16} />
            Home
          </button>

          {pageTitle === "Quick View" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
            >
              <Settings size={18} />
              Setup Quick View
            </button>
          )}

          <div className="relative">
            <MessageSquare className="text-white" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="relative">
            <Bell className="text-white" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-white">
            A
          </div>
        </div>
      </header>
      {isModalOpen && (
        <SetupQuickViewModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
