import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types";
import { BASE_URL } from "@/lib/url";
import { getCookie } from "cookies-next";

const token = () => getCookie("authToken");

export const useUnreadCounts = (userId?: string) =>
  useQuery({
    queryKey: ["unreadCounts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/v1/messages/unread-counts?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const data = await res.json();
      return data.unreadCounts || {};
    },
  });

export const useLastMessages = (userId?: string) =>
  useQuery({
    queryKey: ["lastMessages", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/v1/messages/last?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const data = await res.json();
      // console.log("data q", data);
      return data.lastMessages || {};
    },
  });

export const useMessages = (senderId?: string, receiverId?: string) =>
  useQuery({
    queryKey: ["messages", senderId, receiverId],
    enabled: !!senderId && !!receiverId,
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/v1/messages?sender=${senderId}&receiver=${receiverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const data = await res.json();
      return data.messages || [];
    },
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: Message) => {
      await fetch(`${BASE_URL}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(message),
      });
      return message;
    },
    onSuccess: (message) => {
      // Invalidate and refetch message list if needed
      queryClient.invalidateQueries({
        queryKey: ["messages", message.sender, message.receiver],
      });
    },
  });
};

export const useMarkAsRead = () =>
  useMutation({
    mutationFn: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string;
    }) => {
      await fetch(`${BASE_URL}/api/v1/messages/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ sender, receiver }),
      });
    },
  });
