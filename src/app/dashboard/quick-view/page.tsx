"use client";

import { useEffect, useState } from "react";
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
  CreditCard,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import SetupQuickViewModal from "@/components/SetupQuickVeiwModal";

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
  "Invoice Generator": <CreditCard className="text-blue-600 w-6 h-6" />,
};

const hrefMap: Record<string, string> = {
  "Driver & Fleet Management": "/dashboard/drivers",
  "Expense Review": "/dashboard/expenses",
  "Driver Chat": "/dashboard/chat",
  "Live GPS Fleet Tracker": "/dashboard/gps-tracker",
  "Fleet Assets Management": "/dashboard/assets",
  "Document Management": "/dashboard/documents",
  "Nearby Services Directory": "/dashboard/tracking",
  "Promo & Referral Control": "/dashboard/promo-referral",
  "BOL Generator": "/dashboard/bol-generator",
  "Admin Settings": "/dashboard/admin-settings",
  "Invoice Generator": "/dashboard/invoice-generator",
};

const QuickViewDashboard = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quickView");
    if (stored) setFeatures(JSON.parse(stored));
  }, []);

  const handleSaveQuickView = (updated: any[]) => {
    setFeatures(updated);
  };

  return (
    <div className="p-4">
      {/* Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          aria-hidden="true"
        />
        <Dialog.Panel className="relative bg-white w-full max-w-md mx-auto rounded-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <SetupQuickViewModal
            onClose={() => setShowModal(false)}
            onSave={handleSaveQuickView}
          />
        </Dialog.Panel>
      </Dialog>

      {/* Header */}
      <div className="bg-blue-700 text-white p-6 rounded-md mb-6 flex justify-between items-center flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="md:text-2xl text-xl font-bold truncate">
            Your Quick View Dashboard
          </h2>
          <p className="md:text-sm text-xs text-white/80 mt-1 truncate">
            Access your top 5 most-used fleet management features instantly
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-blue-700 font-semibold md:px-4 p-2 md:py-2 rounded-md hover:bg-gray-100 mt-2 md:mt-0"
        >
          Edit
        </button>
      </div>

      {/* Features Grid */}
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
              <h3 className="text-lg font-semibold text-black mt-3 truncate">
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
