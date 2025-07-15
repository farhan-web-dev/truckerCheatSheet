"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  MessageCircle,
  Map,
  FileText,
  FolderOpen,
  LocateIcon,
  Gift,
  FilePlus2,
  Settings,
  Eye,
} from "lucide-react";

const iconMap: Record<string, JSX.Element> = {
  "Driver & Fleet Management": <Users className="text-blue-600 w-6 h-6" />,
  "Expense Review": <DollarSign className="text-blue-600 w-6 h-6" />,
  "Driver Chat": <MessageCircle className="text-blue-600 w-6 h-6" />,
  "Live GPS Fleet Tracker": <Map className="text-blue-600 w-6 h-6" />,
  "Fleet Assets Management": <FileText className="text-blue-600 w-6 h-6" />,
  "Document Management": <FolderOpen className="text-blue-600 w-6 h-6" />,
  "Nearby Services Directory": <LocateIcon className="text-blue-600 w-6 h-6" />,
  "Promo & Referral Control": <Gift className="text-blue-600 w-6 h-6" />,
  "BOL Generator": <FilePlus2 className="text-blue-600 w-6 h-6" />,
  "Admin Settings": <Settings className="text-blue-600 w-6 h-6" />,
};

const hrefMap: Record<string, string> = {
  "Driver & Fleet Management": "/dashboard/drivers",
  "Expense Review": "/dashboard/expenses",
  "Driver Chat": "/dashboard/chat",
  "Live GPS Fleet Tracker": "/dashboard/gps-tracker",
  "Fleet Assets Management": "/dashboard/assets",
  "Document Management": "/dashboard/documents",
  "Nearby Services Directory": "/dashboard/nearby-services",
  "Promo & Referral Control": "/dashboard/promo-referral",
  "BOL Generator": "/dashboard/bol-generator",
  "Admin Settings": "/dashboard/admin-settings",
};

const QuickViewDashboard = () => {
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("quickView");
    if (stored) setFeatures(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4">
      <div className="bg-blue-700 text-white p-6 rounded-md mb-6">
        <h2 className="text-2xl font-bold">Your Quick View Dashboard</h2>
        <p className="text-sm text-white/80 mt-1">
          Access your top 5 most-used fleet management features instantly
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Link key={feature.id} href={hrefMap[feature.title] || "#"}>
            <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer transition">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 p-2 rounded-md">
                  {iconMap[feature.title] || (
                    <Eye className="text-blue-600 w-6 h-6" />
                  )}
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  #{index + 1}
                  <Eye size={14} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mt-3">
                {feature.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickViewDashboard;
