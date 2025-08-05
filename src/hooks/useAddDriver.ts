// hooks/useAddDriver.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export type DriverFormData = {
  name: string;
  email: string;
  password: string;
  gpsTracking: "enable" | "disable";
  role: "driver" | "admin";
  assignedTruck: string;
  phone: number;
  companyDOTNumber: string;
};

export const useAddDriver = () => {
  const token = getCookie("authToken");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDriver: DriverFormData) => {
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
