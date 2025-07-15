import { fetchMaintenanceByTruckId } from "@/lib/api/maintenance";
import { useQuery } from "@tanstack/react-query";

export const useMaintenanceByTruckId = (id: string) => {
  return useQuery({
    queryKey: ["maintenance", id],
    queryFn: () => fetchMaintenanceByTruckId(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
