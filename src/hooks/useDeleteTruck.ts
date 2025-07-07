import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/url";

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/api/v1/trucks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete truck";

        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // Response was empty – ignore parse error
        }

        throw new Error(errorMessage);
      }

      // Try to parse response only if it's not empty
      try {
        return await res.json();
      } catch {
        return null; // If no content, return null safely
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });
};
