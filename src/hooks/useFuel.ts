import { useQuery } from "@tanstack/react-query";
import {
  fetchFuel,
  fetchFuelAnalytics,
  fetchFuelByFleet,
} from "@/lib/api/fuel";

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

export const useFuelByFleet = (id: string) => {
  return useQuery({
    queryKey: ["fuel", id],
    queryFn: () => fetchFuelByFleet(id),
    enabled: !!id, // prevents running when id is undefined
    staleTime: 1000 * 60, // 1 minute
  });
};
