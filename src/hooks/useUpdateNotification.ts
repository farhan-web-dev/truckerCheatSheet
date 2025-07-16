import { BASE_URL } from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const token = getCookie("authToken");

      const res = await fetch(
        `${BASE_URL}/api/v1/users/updateNotificationSettings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Failed to update settings");

      return res.json();
    },

    onSuccess: () => {
      // ✅ Refetch the query after successful update
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
    },
  });
};
