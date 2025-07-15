import { getCookie } from "cookies-next";
import { BASE_URL } from "../url";

export const fetchMaintenanceByTruckId = async (id: string) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/maintenance/truck/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Maintenance for truck not found");
  }

  const json = await res.json();

  return json.data?.maintenanceLogs || [];
};
