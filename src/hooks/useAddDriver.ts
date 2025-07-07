// hooks/useAddDriver.ts
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export type DriverFormData = {
  name: string;
  email: string;
  gpsTracking: "enable" | "disable";
  role: "driver" | "admin";
  assignedTruck: string;
};

export const useAddDriver = () => {
  const token = getCookie("authToken");
  return useMutation({
    mutationFn: async (newDriver: DriverFormData) => {
      console.log("Submitting driver:", newDriver);
      const res = await fetch(`${BASE_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDriver),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create driver");
      }

      return res.json();
    },
  });
};
