"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import socket from "@/lib/socket";
import { Message, User } from "@/types";
import UserList from "@/components/userList";
import { useLoginUserVeiw } from "@/hooks/useUser";
import {
  useUnreadCounts,
  useLastMessages,
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "@/hooks/useMessages";
import { useSearchParams } from "next/navigation";

export default function Chat() {
  const searchParams = useSearchParams();
  const documentUrl = searchParams.get("documentUrl");
  const documentName = searchParams.get("documentName");
  const [input, setInput] = useState("");
  const [sharedDocSent, setSharedDocSent] = useState(false);

  const [receiver, setReceiver] = useState<User | null>(null);
  const { data } = useLoginUserVeiw();

  useEffect(() => {
    if (documentUrl && documentName) {
      // Show pre-filled message or handle it
      console.log("Shared document:", documentName, documentUrl);
    }
  }, [documentUrl, documentName]);

  const sender = useMemo(() => {
    if (!data?._id) return null;
    return {
      _id: data._id,
      name: data.name || "You",
    };
  }, [data]);

  const receiverRef = useRef<User | null>(null);
  const senderRef = useRef(sender);

  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);

  useEffect(() => {
    senderRef.current = sender;
  }, [sender]);

  const { data: unreadCounts = {}, refetch: refetchUnread } = useUnreadCounts(
    sender?._id
  );
  const { data: userLastMessages = {} } = useLastMessages(sender?._id);
  const { data: messages = [], refetch: refetchMessages } = useMessages(
    sender?._id,
    receiver?._id
  );

  const { mutateAsync: sendMessageAPI } = useSendMessage();
  const { mutateAsync: markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (receiver && sender?._id) {
      markAsRead({ sender: receiver._id, receiver: sender._id }).then(() => {
        refetchUnread();
      });
    }
  }, [receiver, sender?._id]);

  useEffect(() => {
    const handleMessage = (msg: Message) => {
      const currentReceiver = receiverRef.current;
      const currentSender = senderRef.current;

      const isChatOpen =
        (msg.sender === currentSender?._id &&
          msg.receiver === currentReceiver?._id) ||
        (msg.receiver === currentSender?._id &&
          msg.sender === currentReceiver?._id);

      if (isChatOpen) {
        refetchMessages();
      } else {
        refetchUnread();
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [refetchMessages, refetchUnread]);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("userOnline", sender?._id);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [sender?._id]);

  const sendMessage = async () => {
    if (!input.trim() || !receiver) return;

    const message: Message = {
      sender: sender?._id,
      receiver: receiver._id,
      content: input,
      timestamp: new Date().toISOString(),
    };

    try {
      await sendMessageAPI(message);
      socket.emit("sendMessage", message);
      setInput("");
      refetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (
      receiver &&
      sender?._id &&
      documentUrl &&
      !sharedDocSent // prevent sending it multiple times
    ) {
      const message: Message = {
        sender: sender._id,
        receiver: receiver._id,
        content: `Shared Document: ${documentName}\n${documentUrl}`,
        timestamp: new Date().toISOString(),
      };

      sendMessageAPI(message)
        .then(() => {
          socket.emit("sendMessage", message);
          refetchMessages();
          setSharedDocSent(true); // mark as sent
        })
        .catch((err) => {
          console.error("Failed to send shared document:", err);
        });
    }
  }, [receiver, sender?._id, documentUrl, sharedDocSent]);

  useEffect(() => {
    if (sharedDocSent) {
      // Remove query params after sending
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [sharedDocSent]);

  return (
    <div className="flex h-[90dvh] overflow-hidden">
      {/* User List */}
      <div
        className={`
        h-full border-r
        ${receiver ? "hidden" : "flex"}   /* full width on mobile */
        md:flex md:w-1/3 lg:w-1/4
        w-full
      `}
      >
        <UserList
          onSelect={setReceiver}
          currentUser={sender?._id}
          userLastMessages={userLastMessages}
          unreadCounts={unreadCounts}
        />
      </div>
      {/* Chat Panel */}
      <div
        className={`flex-1 flex flex-col ${
          receiver ? "flex" : "hidden"
        } md:flex`}
      >
        {receiver ? (
          <>
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex  items-center gap-3 shrink-0">
              <button
                className="md:hidden mr-2"
                onClick={() => setReceiver(null)}
              >
                ←
              </button>

              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                {receiver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-white text-base">
                  {receiver.name}
                </p>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center mt-4">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn =
                      msg?.sender === sender?._id ||
                      msg?.sender?._id === sender?._id;

                    return (
                      <div
                        key={idx}
                        className={`my-2 max-w-md ${
                          isOwn ? "ml-auto text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block px-4 py-2 rounded-lg ${
                            isOwn
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
                    );
                  })
                )}
              </div>

              {/* Input Bar */}
              <div className="flex items-center p-2 border-t bg-white shrink-0">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2 border rounded-l-md focus:outline-none text-gray-900"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
