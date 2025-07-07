import { useQuery } from "@tanstack/react-query";
import { fetchFuel, fetchFuelAnalytics } from "@/lib/api/fuel";

export const useFuel = () => {
  return useQuery({
    queryKey: ["fuel"],
    queryFn: fetchFuel,
    staleTime: 1000 * 60,
  });
};

export const useFuelAnalytics = () => {
  return useQuery({
    queryKey: ["fuelAnalytics"],
    queryFn: fetchFuelAnalytics,
    staleTime: 1000 * 60,
  });
};
