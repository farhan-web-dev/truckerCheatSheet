"use client";

import { useParams } from "next/navigation";
import { useTruckById } from "@/hooks/useTruck";
import { useState } from "react";
import {
  Truck as TruckIcon,
  Wrench,
  FileText,
  Fuel,
  FileSearch,
} from "lucide-react";
import Link from "next/link";
import { useMaintenanceByTruckId } from "@/hooks/useMaintenance";
import { useExpenseByTruckId } from "@/hooks/useExpense";
import { useFuelByFleet } from "@/hooks/useFuel";
import { useDocumentsByTruckId } from "@/hooks/useDocument";
import DocumentsList from "@/components/DocumentList";
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";

const TABS = [
  "Overview",
  "Maintenance",
  "Receipts",
  "Fuel Records",
  "Documents",
] as const;
type TabType = (typeof TABS)[number];

const AssetDetailsPage = () => {
  const { id } = useParams();

  const { data: truck, isLoading, isError } = useTruckById(id as string);
  const {
    data: maintenance,
    isLoading: maintenanceLoading,
    isError: maintenanceError,
  } = useMaintenanceByTruckId(id as string);
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const maintenanceCost = maintenance?.reduce(
    (total: number, item: any) => total + item.cost,
    0
  );
  const { data: expenses } = useExpenseByTruckId(id as string);
  // console.log("Expenses:", expenses);

  const lastMaintenance = maintenance?.[maintenance.length - 1];

  const nextMaintenanceDate = lastMaintenance?.nextServiceDate
    ? new Date(lastMaintenance.nextServiceDate).toLocaleDateString()
    : "No next maintenance scheduled";

  const {
    data: fuelRecords,
    isLoading: fuelLoading,
    isError: fuelError,
  } = useFuelByFleet(id as string);
  const { data: documents } = useDocumentsByTruckId(id as string);
  // console.log("doc", documents);

  if (isLoading) return <RouteLoadingSpinner />;
  if (isError || !truck)
    return <div className="text-red-500 p-4">Truck not found</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Total Receipts" value={expenses?.length} />
              <StatCard
                title="Maintenance Cost"
                value={`$${maintenanceCost?.toFixed(2) || "0.00"}`}
              />
              <StatCard title="Fuel Records" value={fuelRecords?.length} />
              <StatCard title="Documents" value={documents?.length} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Asset Information">
                <p>
                  <span className="text-gray-400">Unit Number</span>
                  <br />
                  <span className="font-semibold text-white">{truck.name}</span>
                </p>
                <p>
                  <span className="text-gray-400">Type</span>
                  <br />
                  <span className="font-semibold text-white">{truck.type}</span>
                </p>
                <p>
                  <span className="text-gray-400">Make & Model</span>
                  <br />
                  <span className="font-semibold text-white">
                    {truck.model}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Year</span>
                  <br />
                  <span className="font-semibold text-white">{truck.year}</span>
                </p>
                <p>
                  <span className="text-gray-400">Current Mileage</span>
                  <br />
                  <span className="font-semibold text-white">
                    {truck.currentMileage} mi
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Acquisition Date</span>
                  <br />
                  <span className="font-semibold text-white">
                    {new Date(truck.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </InfoCard>

              <InfoCard title="Assignment & Status">
                <p>
                  <span className="text-gray-400">Assigned Driver</span>
                  <br />
                  <span className="font-semibold text-white">
                    {truck.assignedDriver?.name || "Unassigned"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Next Maintenance</span>
                  <br />
                  <span className="font-semibold text-white">
                    {nextMaintenanceDate}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Avg Fuel Price</span>
                  <br />
                  <span className="font-semibold text-white">
                    ${truck.avgFuelPrice?.toFixed(2)}/gal
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Status</span>
                  <br />
                  <span className="bg-green-600 text-white font-medium py-1 px-3 rounded-full text-sm">
                    {truck.status || "Active"}
                  </span>
                </p>
              </InfoCard>
            </div>
          </div>
        );

      case "Maintenance":
        return (
          <div className="text-sm text-gray-300">
            <h3 className="text-lg mb-4 font-semibold">Maintenance History</h3>
            <ul className="space-y-4">
              {maintenance?.length > 0 ? (
                maintenance?.map((item: any, i: number) => {
                  const date = new Date(item.createdAt)
                    .toISOString()
                    .split("T")[0];
                  return (
                    <li
                      key={i}
                      className="p-4 bg-gray-800 rounded-md flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-blue-400 font-bold text-lg capitalize">
                            {item.serviceType?.replace(
                              /([a-z])([A-Z])/g,
                              "$1 $2"
                            )}
                          </h4>
                          <span className="text-gray-400 text-md">{date}</span>
                        </div>
                        <p className="text-gray-300 mb-1">
                          {item.description || "No description provided."}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Mileage: {item.mileage.toLocaleString()} {item.unit}
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className="text-green-400 font-semibold text-lg">
                          ${item.cost}
                        </p>
                        {nextMaintenanceDate && (
                          <p className="text-sm text-gray-400">
                            Next Due: {nextMaintenanceDate}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <p>No maintenance records.</p>
              )}
            </ul>
          </div>
        );

      case "Receipts":
        return (
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Repair & Maintenance Receipts
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Add Receipt
              </button>
            </div>

            {expenses?.length === 0 ? (
              <p className="text-gray-400">No receipts found.</p>
            ) : (
              <div className="space-y-4">
                {expenses?.map((expense: any) => (
                  <div
                    key={expense._id}
                    className="bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {expense.vendor || "Unknown Vendor"}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {expense.date || "2025-01-01"} • Receipt #
                          {expense.receiptNumber || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-lg font-bold">
                          ${expense.amount}
                        </p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            expense.type.toLowerCase() === "repair"
                              ? "bg-red-700"
                              : "bg-blue-700"
                          }`}
                        >
                          {expense.type.charAt(0).toUpperCase() +
                            expense.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mb-2">
                      {expense.notes || "No description available"}
                    </p>

                    <div className="text-xs text-gray-400 flex justify-between border-t border-gray-700 pt-2">
                      <span>Unit: {truck?.name || "Unknown"}</span>
                      <span className="flex gap-4">
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          className="text-blue-400 hover:underline"
                        >
                          View
                        </a>
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          download
                          className="text-blue-400 hover:underline"
                        >
                          Download
                        </a>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "Fuel Records":
        return (
          <div className="p-6 bg-[#1e293b] min-h-screen text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Fuel Purchase Records</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Add Fuel Record
              </button>
            </div>

            {fuelRecords?.length === 0 ? (
              <p className="text-gray-400">
                No fuel records found for this unit.
              </p>
            ) : (
              fuelRecords?.map((f, i) => (
                <div
                  key={f._id}
                  className="bg-[#334155] rounded-xl p-6 mb-4 shadow-md flex flex-col gap-4"
                >
                  {/* Top row: Station name and cost */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <span className="text-orange-400">
                        <Fuel className="w-5 h-5" />
                      </span>
                      {f.station}
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-xl font-bold">
                        ${f.total_cost.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-300">
                        ${f.price_per_gallon.toFixed(2)}/gal
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-400">
                    {new Date(f.date).toISOString().split("T")[0]}
                  </div>

                  {/* Bottom row: Gallons, Mileage, Unit */}
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-300 mt-2">
                    <div>
                      <div className="text-xs uppercase">Gallons</div>
                      <div className="text-white text-base">{f.gallons}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Mileage</div>
                      <div className="text-white text-base">
                        {f.odometer.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Unit</div>
                      <div className="text-white text-base">{truck?.name}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "Documents":
        return <DocumentsList documents={documents} />;

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] text-white min-h-screen space-y-6">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full  flex items-center justify-between space-x-4">
        {/* Back arrow icon */}

        <div className="flex-shrink-0">
          <Link href="/dashboard/assets">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>

        {/* Unit details */}
        <div className="flex-grow">
          <h1 className="text-white text-2xl font-semibold mb-1">
            {truck.name}
          </h1>
          <p className="text-gray-400 text-base">
            {truck.year} {truck.model}
          </p>
        </div>

        {/* Truck button */}
        <div className="flex-shrink-0 bg-blue-500 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-xl shadow-md transition duration-200 ease-in-out">
          {truck.type === "truck" ? "Truck" : "Trailer"}
        </div>
      </div>
      <div className="flex gap-8 items-center border-b border-gray-700 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1 text-sm font-medium pb-1 ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {getTabIcon(tab)}
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

export default AssetDetailsPage;

// 🔧 Helper Components
const StatCard = ({ title, value }: { title: string; value: any }) => (
  <div className="bg-[#1e293b] p-4 rounded-lg">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-[#2d3748] p-6 rounded-md min-h-[320px]">
    <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
    <div className="space-y-4 text-sm text-gray-300">{children}</div>
  </div>
);

// Icon selector
const getTabIcon = (tab: string) => {
  switch (tab) {
    case "Overview":
      return <TruckIcon className="w-4 h-4" />;
    case "Maintenance":
      return <Wrench className="w-4 h-4" />;
    case "Receipts":
      return <FileText className="w-4 h-4" />;
    case "Fuel Records":
      return <Fuel className="w-4 h-4" />;
    case "Documents":
      return <FileSearch className="w-4 h-4" />;
    default:
      return null;
  }
};
