// lib/api/truck.ts
import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export const fetchTruck = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/trucks`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No trucks found");
  }

  const json = await res.json();

  console.log("Fetched trucks:", json.data.trucks);

  return json.data.trucks;
};

// ✅ Fetch truck by ID
export const fetchTruckById = async (id: string) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/trucks/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Truck not found");
  }

  const json = await res.json();

  console.log("Fetched truck:", json.data.truck);

  return json.data.truck;
};
