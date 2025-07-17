import { BASE_URL } from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useGetNotificationSettings = () => {
  const token = getCookie("authToken");
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/v1/users/notification-settings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch settings");

      const data = await res.json();
      // console.log("result", data);
      return data;
    },
  });
};
