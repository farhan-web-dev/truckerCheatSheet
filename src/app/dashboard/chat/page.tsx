"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { Message, User } from "@/types";
import UserList from "@/components/userList";
import { getCookie } from "cookies-next";

import { useLoginUserVeiw } from "@/hooks/useUser";
import { BASE_URL } from "@/lib/url";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [receiver, setReceiver] = useState<User | null>(null);
  const [userLastMessages, setUserLastMessages] = useState<
    Record<string, { content: string; timestamp: string }>
  >({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const { data, loading } = useLoginUserVeiw();
  console.log("data me", data, loading);

  // correct this when login is implemnted and also check that wheater the sender message is shwoing blue or not
  const sender = { _id: data?._id, name: data?.name || "You" };
  console.log("sender", sender);

  // Store latest sender & receiver in refs for use in socket handler
  const receiverRef = useRef<User | null>(null);
  const senderRef = useRef(sender);

  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const token = getCookie("authToken");

      const res = await fetch(
        `${BASE_URL}/api/v1/messages/unread-counts?userId=${sender._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch unread counts");
        return;
      }

      const data = await res.json();
      setUnreadCounts(data.unreadCounts || {});
    };

    fetchUnreadCounts();
  }, []);

  useEffect(() => {
    if (receiver) {
      const markAsRead = async () => {
        const token = getCookie("authToken");

        await fetch(`${BASE_URL}/api/v1/messages/mark-read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sender: receiver._id, receiver: sender._id }),
        });

        // Reset count in UI
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[receiver._id];
          return updated;
        });
      };

      markAsRead();
    }
  }, [receiver]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const token = getCookie("authToken");

      const res = await fetch(
        `${BASE_URL}/api/v1/messages/last?userId=${sender._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch last messages");
        return;
      }

      const data = await res.json();
      setUserLastMessages(data.lastMessages || {});
    };

    fetchLastMessages();
  }, []);

  console.log("last", userLastMessages);
  // Fetch previous messages when receiver is selected

  useEffect(() => {
    if (!receiver) return;
    const fetchMessages = async () => {
      try {
        const token = getCookie("authToken");

        const res = await fetch(
          `${BASE_URL}/api/v1/messages?sender=${sender._id}&receiver=${receiver._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Add the token here
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch messages");
          return;
        }

        const data = await res.json();
        setMessages(data?.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [receiver]);

  // const lastMessage = messages[messages.length - 1];
  console.log(messages);

  // Listen for incoming messages
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      const currentReceiver = receiverRef.current;
      const currentSender = senderRef.current;

      if (
        (msg.sender === currentSender._id &&
          msg.receiver === currentReceiver?._id) ||
        (msg.receiver === currentSender._id &&
          msg.sender === currentReceiver?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  // Mark user online when socket connects
  useEffect(() => {
    const handleConnect = () => {
      socket.emit("userOnline", sender._id);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !receiver) return;

    const message: Message = {
      sender: sender._id,
      receiver: receiver._id,
      content: input,
      timestamp: new Date().toISOString(),
    };

    try {
      const token = getCookie("authToken");

      await fetch(`${BASE_URL}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      socket.emit("sendMessage", message);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen ">
      <UserList
        onSelect={setReceiver}
        currentUser={sender._id}
        userLastMessages={userLastMessages}
        unreadCounts={unreadCounts}
      />

      <div className="flex-1 flex flex-col">
        {receiver ? (
          <>
            <div className="bg-blue-600 text-white p-4 rounded-t flex items-center gap-3">
              {/* Avatar with initials */}
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                {receiver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Name and status */}
              <div>
                <p className="font-semibold text-white text-base">
                  {receiver.name}
                </p>
                {/* <p className="text-sm font-light text-white">online</p> */}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`my-2 max-w-md ${
                    msg.sender === sender._id
                      ? "ml-auto text-right"
                      : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.sender === sender._id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none shadow"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center p-2 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-l-md focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-xl text-center m-auto">
            Select a user to chat
          </p>
        )}
      </div>
    </div>
  );
}
