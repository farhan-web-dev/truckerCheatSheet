import { useQuery } from "@tanstack/react-query";
import { fetchTruck } from "@/lib/api/truck";

export const useTruckVeiw = () => {
  return useQuery({
    queryKey: ["trucks"],
    queryFn: fetchTruck,
    staleTime: 1000 * 60,
  });
};
