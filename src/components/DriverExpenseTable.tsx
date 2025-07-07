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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Driver Expense Report</h2>
        <div className="flex gap-2">
          <select
            className="border px-2 py-1 rounded text-sm"
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
          >
            <option value={0}>All Time</option>
            <option value={3}>Last 3 Days</option>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            onClick={() => exportCSV(expenseData?.data?.expenses || [])}
          >
            Export Report
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">DRIVER</th>
              <th className="py-2">TYPE</th>
              <th className="py-2">AMOUNT</th>
              <th className="py-2">DATE</th>
              <th className="py-2">RECEIPT</th>
              <th className="py-2">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {expenseData?.data?.expenses?.map((expense: any) => (
              <tr key={expense._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{expense.driverId?.name || "Unknown"}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      typeColorMap[expense.type?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {expense.type}
                  </span>
                </td>
                <td className="py-2 font-semibold">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="py-2">
                  {new Date(expense.date).toLocaleDateString("en-US")}
                </td>
                <td className="py-2">
                  {expense.receiptUrl ? (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      View Receipt
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2">{expense.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverExpenseTable;
