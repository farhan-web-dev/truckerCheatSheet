"use client";

import React, { useState } from "react";
import { useExpense } from "@/hooks/useExpense";
import { exportCSV } from "@/lib/export";

const typeColorMap: Record<string, string> = {
  fuel: "bg-green-100 text-green-700",
  maintenance: "bg-red-100 text-red-700",
  meals: "bg-yellow-100 text-yellow-700",
  lodging: "bg-purple-100 text-purple-700",
  tolls: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-700",
};

const DriverExpenseTable = () => {
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const { data: expenseData = [], isLoading } = useExpense(selectedDays);

  return (
    <div className="bg-white text-black rounded-lg p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold">Driver Expense Report</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
          >
            <option value={0}>All Time</option>
            <option value={3}>Last 3 Days</option>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            onClick={() => exportCSV(expenseData?.data?.expenses || [])}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">DRIVER</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">RECEIPT</th>
                  <th className="py-3 px-4">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {expenseData?.data?.expenses?.map((expense: any) => (
                  <tr key={expense._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {expense.driverId?.name || "Unknown"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          typeColorMap[expense.type?.toLowerCase()] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {expense.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(expense.date).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-3 px-4">
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4">{expense.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {expenseData?.data?.expenses?.map((expense: any) => (
              <div
                key={expense._id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <p className="text-sm">
                  <span className="font-semibold">Driver:</span>{" "}
                  {expense.driverId?.name || "Unknown"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Type:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      typeColorMap[expense.type?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {expense.type}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Amount:</span> $
                  {expense.amount.toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(expense.date).toLocaleDateString("en-US")}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Receipt:</span>{" "}
                  {expense.receiptUrl ? (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Notes:</span>{" "}
                  {expense.notes || "-"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DriverExpenseTable;
