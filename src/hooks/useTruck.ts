import { useQuery } from "@tanstack/react-query";
import { fetchTruck, fetchTruckById } from "@/lib/api/truck";

// ✅ Fetch all trucks
export const useTruckVeiw = () => {
  return useQuery({
    queryKey: ["trucks"],
    queryFn: fetchTruck,
    staleTime: 1000 * 60,
  });
};

// ✅ Fetch single truck by ID
export const useTruckById = (id: string) => {
  return useQuery({
    queryKey: ["truck", id],
    queryFn: () => fetchTruckById(id),
    enabled: !!id, // prevents running when id is undefined
    staleTime: 1000 * 60, // 1 minute
  });
};
