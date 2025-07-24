// Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Bell, MessageSquare, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";
import SetupQuickViewModal from "./SetupQuickVeiwModal";
import NotificationBell from "./NotificationModal";
import { useUnreadCounts } from "@/hooks/message";
import { useLoginUserVeiw } from "@/hooks/useUser";
import ClientOnly from "./ClientOnly";

const routeToTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/gps-tracker": "GPS Tracker",
  "/dashboard/driver-management": "Driver Management",
  "/dashboard/quick-view": "Quick View",
  "/dashboard/chat": "Driver Chat",
  "/dashboard/assets": "Fleet Assets Management",
  "/dashboard/documents": "Document Management",
  "/dashboard/tracking": "Nearby Services Directory",
  "/dashboard/rewards": "Promo & Referral Control",
  "/dashboard/bol-generator": "BOL Generator",
  "/dashboard/admin-settings": "Admin Settings",
};

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = routeToTitleMap[pathname] || "Fleet Management";
  const { data: loginUser } = useLoginUserVeiw();

  const { data: unreadCounts = {}, refetch: refetchUnread } = useUnreadCounts(
    loginUser?._id
  );

  const totalUnreadMessages = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <ClientOnly>
      <header className="bg-[#0E1423] text-white px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side: Title */}
          <div className="sm:text-left text-center w-full sm:w-auto">
            <h1 className="text-2xl font-bold hidden sm:block">{pageTitle}</h1>

            <p className="text-sm text-gray-400 hidden md:block lg:block">
              Fleet Management Dashboard
            </p>
          </div>

          {/* Right side: Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-3">
            <button className="flex items-center gap-2 bg-[#2B3448] hover:bg-[#3A4358] text-white px-4 py-2 rounded-md text-sm">
              <ArrowLeft size={16} />
              Home
            </button>

            {pageTitle === "Quick View" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
              >
                <Settings size={18} />
                Setup Quick View
              </button>
            )}

            <div className="relative">
              <MessageSquare className="text-white" />
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {totalUnreadMessages}
                </span>
              )}
            </div>

            <div className="relative">
              <NotificationBell />
            </div>

            {loginUser?.profileUrl ? (
              <img
                src={loginUser?.profileUrl}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-white">
                {loginUser?.name?.[0] || "A"}
              </div>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <SetupQuickViewModal onClose={() => setIsModalOpen(false)} />
      )}
    </ClientOnly>
  );
};

export default Header;
