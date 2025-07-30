"use client";

import { useState } from "react";
import {
  BarChart2,
  Clock,
  Users,
  Truck,
  MessageCircle,
  FileText,
  DollarSign,
  MapPin,
  Gift,
  Menu,
  X,
  FilePen,
  Settings,
  MapIcon,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import ClientOnly from "./ClientOnly";
import { usePathname } from "next/navigation";

const iconProps = { size: 20, color: "white" };

const menuItems = [
  { label: "Overview", icon: <BarChart2 {...iconProps} />, href: "/dashboard" },
  {
    label: "Quick View",
    icon: <Clock {...iconProps} />,
    href: "/dashboard/quick-view",
  },
  {
    label: "Driver & Fleet Management",
    icon: <Users {...iconProps} />,
    href: "/dashboard/drivers",
  },
  {
    label: "Fleet Assets Management",
    icon: <Truck {...iconProps} />,
    href: "/dashboard/assets",
  },
  {
    label: "Driver Chat",
    icon: <MessageCircle {...iconProps} />,
    href: "/dashboard/chat",
  },
  {
    label: "Document Management",
    icon: <FileText {...iconProps} />,
    href: "/dashboard/documents",
  },
  {
    label: "Expense Review",
    icon: <DollarSign {...iconProps} />,
    href: "/dashboard/expenses",
  },
  {
    label: "Nearby Services Directory",
    icon: <MapPin {...iconProps} />,
    href: "/dashboard/tracking",
  },
  {
    label: "Live GPS Fleet Tracker",
    icon: <MapIcon {...iconProps} />,
    href: "/dashboard/gps-tracker",
  },
  {
    label: "Promo & Referral Control",
    icon: <Gift {...iconProps} />,
    href: "/dashboard/rewards",
  },
  {
    label: "Invoice Generator",
    icon: <CreditCard {...iconProps} />,
    href: "/dashboard/invoice-generator",
  },
  {
    label: "BOL Generator",
    icon: <FilePen {...iconProps} />,
    href: "/dashboard/bol-generator",
  },
  {
    label: "Admin Settings",
    icon: <Settings {...iconProps} />,
    href: "/dashboard/admin-settings",
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <ClientOnly>
      <div
        className={clsx(
          "bg-[#0f172a] h-screen p-4 flex flex-col overflow-y-auto",
          expanded ? "w-64" : "w-24"
        )}
      >
        <div className="flex items-center justify-between text-white mb-6">
          <div className="flex items-center gap-2">
            <Truck className="text-blue-400" />
            {expanded && (
              <span className="text-[24px] font-bold">Fleet Admin</span>
            )}
          </div>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <X className="text-white w-[24px]" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map(({ label, icon, href }) => {
            const isActive = pathname === href;

            return (
              <Link key={label} href={href} className="text-white">
                <div
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded transition-all",
                    isActive ? "bg-blue-700" : "hover:bg-blue-600"
                  )}
                >
                  {icon}
                  {expanded && <span className="ml-3 block">{label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </ClientOnly>
  );
}
