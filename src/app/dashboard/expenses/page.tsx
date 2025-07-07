"use client";

import DriverExpenseTable from "@/components/DriverExpenseTable";
import { useExpense, useExpenseAnalytics } from "@/hooks/useExpense";
import { useFuel, useFuelAnalytics } from "@/hooks/useFuel";
import { exportCSV, exportJSON, exportQuickBooksFormat } from "@/lib/export";
import { Download } from "lucide-react";

import React from "react";

const FuelExpenses = () => {
  const { data: fuelData = [], isLoading, isError } = useFuel();
  const {
    data: fuelAnalytics = [],
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useFuelAnalytics();
  const { data: expenseData = [] } = useExpenseAnalytics();
  const { data: expense = [] } = useExpense();

  return (
    <div className="bg-[#0d1117] text-white p-6 space-y-4">
      {/* === Export Buttons === */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => exportCSV(expense?.data?.expenses || [])}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
        <button
          onClick={() => exportQuickBooksFormat(expense?.data?.expenses || [])}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          QuickBooks
        </button>
        <button
          onClick={() => exportJSON(expense?.data?.expenses || [])}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          JSON
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white text-black rounded-lg p-4">
          <div className="text-sm">This Week</div>
          <div className="text-2xl font-bold">
            ${expenseData?.data?.weekly?.totalAmount}
          </div>
          <div className="text-xs">
            {expenseData?.data?.weekly?.totalCount} expenses
          </div>
        </div>
        <div className="bg-white text-black rounded-lg p-4">
          <div className="text-sm">Fuel Costs</div>
          <div className="text-2xl font-bold">
            ${expenseData?.data?.weekly?.fuel?.amount}
          </div>
          <div className="text-xs">
            {expenseData?.data?.weekly?.fuel?.count} items
          </div>
        </div>
        <div className="bg-white text-black rounded-lg p-4">
          <div className="text-sm">Maintenance</div>
          <div className="text-2xl font-bold">
            ${expenseData?.data?.weekly?.maintenance?.amount}
          </div>
          <div className="text-xs">
            {expenseData?.data?.weekly?.maintenance?.count} items
          </div>
        </div>
        <div className="bg-white text-black rounded-lg p-4">
          <div className="text-sm">Total Expenses</div>
          <div className="text-2xl font-bold">
            ${expenseData?.data?.total?.totalAmount}
          </div>
          <div className="text-xs">
            {expenseData?.data?.total?.totalCount} items
          </div>
        </div>
      </div>

      {/* Fuel Cost Analytics */}
      <div className="bg-white text-black rounded-lg p-4">
        <h2 className="text-xl font-bold">Fuel Cost Analytics</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded bg-blue-50 text-blue-700">
            <div className="font-bold text-md">Total Gallons</div>
            <div className="text-2xl font-semibold">
              {fuelAnalytics?.data?.totalGallons}
            </div>
            <div className="text-xs">Diesel purchased</div>
          </div>
          <div className="p-4 rounded bg-green-50 text-green-700">
            <div className="font-bold text-md">DEF Gallons</div>
            <div className="text-2xl font-semibold">
              {fuelAnalytics?.data?.defGallons}
            </div>
            <div className="text-xs">DEF purchased</div>
          </div>
          <div className="p-4 rounded bg-yellow-50 text-yellow-700">
            <div className="font-bold text-md">Avg Price/Gal</div>
            <div className="text-2xl font-semibold">
              {fuelAnalytics?.data?.avgPricePerGallon}
            </div>
            <div className="text-xs">Current diesel rate</div>
          </div>
          <div className="p-4 rounded bg-purple-50 text-purple-700">
            <div className="font-bold text-md">Monthly Comparison</div>
            <div className="text-2xl font-semibold">
              {fuelAnalytics?.data?.monthlyComparison}
            </div>
            <div className="text-xs">vs last month</div>
          </div>
        </div>
      </div>

      {/* Filtered and separated fuel cards */}
      {/* === Fuel Cost Trend Header === */}
      <div className="bg-white text-black p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          Fuel Cost Trends (Last 30 Days)
        </h2>
        <div className="bg-gray-50 border-dashed border h-48 flex items-center justify-center rounded">
          <div className="text-center text-gray-500">
            <div className="font-medium text-base">Fuel Cost Trend Chart</div>
            <div className="text-sm">1 days with fuel purchases</div>
            <div className="text-sm mt-1">
              Peak:{" "}
              <span className="text-green-700 font-semibold">$184.90</span> |
              Avg: <span className="text-blue-700 font-semibold">$6.16</span>
            </div>
          </div>
        </div>

        {/* === Driver / Vehicle / Station Columns === */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {/* === Fuel by Driver === */}
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-2">
              Fuel by Driver
            </h3>
            {fuelData?.data?.map((log: any) => (
              <div
                key={`driver-${log._id}`}
                className="bg-green-50 text-green-900 p-4 rounded mb-2 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">
                    {log.driver_id?.name || "Unknown Driver"}
                  </div>
                  <div className="text-sm text-gray-600">{log.gallons} gal</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${(log.price_per_gallon * log.gallons).toFixed(2)}
                  </div>
                  <div className="text-xs text-green-700">
                    ${log.price_per_gallon}/gal
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === Fuel by Vehicle === */}
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-2">
              Fuel by Vehicle
            </h3>
            {fuelData?.data?.map((log: any) => (
              <div
                key={`vehicle-${log._id}`}
                className="bg-blue-50 text-blue-900 p-4 rounded mb-2 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">
                    {log.vehicle_id || "Unknown Vehicle"}
                  </div>
                  <div className="text-sm text-gray-600">{log.gallons} gal</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${(log.price_per_gallon * log.gallons).toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-700">
                    ${log.price_per_gallon}/gal
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === Fuel Stations === */}
          <div>
            <h3 className="text-gray-800 text-lg font-semibold mb-2">
              Fuel Stations
            </h3>
            {/* Sample unique station entries */}
            {[
              ...new Map(
                fuelData?.data?.map((log: any) => [log.station, log])
              ).values(),
            ].map((station: any) => (
              <div
                key={`station-${station._id}`}
                className="bg-white text-black p-4 rounded-lg mb-2 flex justify-between items-center border"
              >
                <div>
                  <div className="font-semibold">{station.station}</div>
                  <div className="text-xs text-gray-500">1 visits</div>
                </div>
                <div className="text-sm font-medium text-blue-700">
                  ${station.price_per_gallon}/gal
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DriverExpenseTable />
    </div>
  );
};

export default FuelExpenses;
