// hooks/useMessages.ts
import { useQuery } from "@tanstack/react-query";
import { Message } from "@/types";
import { BASE_URL } from "@/lib/url";

const fetchMessages = async (
  sender: string,
  receiver: string
): Promise<Message[]> => {
  const res = await fetch(`${BASE_URL}/api/messages/${sender}/${receiver}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export const useMessages = (sender: string, receiver: string) => {
  return useQuery({
    queryKey: ["messages", sender, receiver],
    queryFn: () => fetchMessages(sender, receiver),
    refetchOnWindowFocus: false,
  });
};
