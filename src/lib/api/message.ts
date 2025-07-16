import { BASE_URL } from "@/lib/url";
import { getCookie } from "cookies-next";

const getHeaders = () => {
  const token = getCookie("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchUnreadCounts = async (userId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/messages/unread-counts?userId=${userId}`,
    {
      headers: getHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch unread counts");
  const json = await res.json();
  return json.unreadCounts;
};

export const fetchLastMessages = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/messages/last?userId=${userId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch last messages");
  const json = await res.json();
  return json.lastMessages;
};

export const fetchMessages = async (senderId: string, receiverId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/messages?sender=${senderId}&receiver=${receiverId}`,
    {
      headers: getHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch messages");
  const json = await res.json();
  return json.messages;
};

export const markMessagesAsRead = async (
  senderId: string,
  receiverId: string
) => {
  const res = await fetch(`${BASE_URL}/api/v1/messages/mark-read`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ sender: senderId, receiver: receiverId }),
  });
  if (!res.ok) throw new Error("Failed to mark messages as read");
  return res.json();
};
