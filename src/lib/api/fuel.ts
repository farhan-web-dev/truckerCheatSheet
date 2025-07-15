import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export const fetchFuel = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/fuel`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch fuel data");
  }

  const data = await res.json();
  return data;
};

export const fetchFuelAnalytics = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/fuel/analytics`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch fuel data");
  }

  const data = await res.json();
  return data;
};

export const fetchFuelByFleet = async (id: string) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/fuel/fleet/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fuel records not found");
  }

  const json = await res.json();
  console.log("Fetched Fuel Records:", json.data);

  return json.data || [];
};
