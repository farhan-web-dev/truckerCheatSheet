"use client";

import { useUserNotifications } from "@/hooks/useUserNotificaiton";
import { Toaster } from "react-hot-toast";

export default function NotificationListener() {
  useUserNotifications();

  return <Toaster position="top-right" reverseOrder={false} />;
}
