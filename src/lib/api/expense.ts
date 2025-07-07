import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export const fetchExpense = async (days = 3) => {
  const token = getCookie("authToken");

  const res = await fetch(
    `${BASE_URL}/api/v1/expense${days > 0 ? `?days=${days}` : ""}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch expense data");
  }

  const data = await res.json();
  return data;
};
export const fetchExpenseAnalytics = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/expense/analytics`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch expense data");
  }

  const data = await res.json();
  return data;
};
