// lib/hooks/message.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchUnreadCounts,
  fetchLastMessages,
  fetchMessages,
  markMessagesAsRead,
} from "@/lib/api/message";

export const useUnreadCounts = (userId: string) => {
  return useQuery({
    queryKey: ["unreadCounts", userId],
    queryFn: () => fetchUnreadCounts(userId),
    enabled: !!userId,
  });
};

export const useLastMessages = (userId: string) => {
  return useQuery({
    queryKey: ["lastMessages", userId],
    queryFn: () => fetchLastMessages(userId),
    enabled: !!userId,
  });
};

export const useMessages = (senderId: string, receiverId: string) => {
  return useQuery({
    queryKey: ["messages", senderId, receiverId],
    queryFn: () => fetchMessages(senderId, receiverId),
    enabled: !!senderId && !!receiverId,
  });
};

export const useMarkMessagesAsRead = () => {
  return useMutation({
    mutationFn: ({
      senderId,
      receiverId,
    }: {
      senderId: string;
      receiverId: string;
    }) => markMessagesAsRead(senderId, receiverId),
  });
};
