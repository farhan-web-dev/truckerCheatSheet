import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/url";
import { getCookie } from "cookies-next";

export type TruckFormData = {
  _id?: string;
  name: string;
  model: string;
  year: number;
  engineType: string;
  engineSerialNumber: string;
  assignedDriver: string;
  type: "truck" | "trailer";
  companyDOTNumber: number;
};

// CREATE Truck
export const useCreateTruck = () => {
  const token = getCookie("authToken");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTruck: TruckFormData) => {
      const res = await fetch(`${BASE_URL}/api/v1/trucks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTruck),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create truck");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });
};

// UPDATE Truck
export const useUpdateTruck = () => {
  const token = getCookie("authToken");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTruck: TruckFormData) => {
      if (!updatedTruck._id) throw new Error("Truck ID is required for update");

      const res = await fetch(`${BASE_URL}/api/v1/trucks/${updatedTruck._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTruck),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update truck");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });
};
