"use client";

// hooks/useUserNotifications.ts
import { useEffect } from "react";
import socket from "@/lib/socket";
import { toast } from "react-hot-toast";

export function useUserNotifications() {
  useEffect(() => {
    const handleNewUser = (data: any) => {
      toast.success(data.message); // Or custom UI
      console.log("📩 New user notification:", data);
    };

    socket.on("new-user-created", handleNewUser);

    return () => {
      socket.off("new-user-created", handleNewUser);
    };
  }, []);
}
