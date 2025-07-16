"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { useUserVeiw } from "@/hooks/useUser";

type Props = {
  onSelect: (user: User) => void;
  currentUser: string;
  userLastMessages: Record<string, { content: string; timestamp: string }>;
  unreadCounts: Record<string, number>;
};

export default function UserList({
  onSelect,
  currentUser,
  userLastMessages,
  unreadCounts,
}: Props) {
  const { data, isLoading, error } = useUserVeiw();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) {
      const filtered = data.filter((u: User) => u._id !== currentUser);
      setUsers(filtered);
    }
  }, [data, currentUser]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (error)
    return <div className="p-4 text-red-600">Failed to load users</div>;

  return (
    <div className="w-1/4 border-r bg-white h-full flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 p-1 px-2 rounded text-sm text-black w-24"
        />
      </div>

      <ul className="overflow-y-auto text-gray-800 flex-1">
        {filteredUsers.map((user) => {
          const last = userLastMessages[user._id];
          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <li
              key={user._id}
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 border-b"
              onClick={() => onSelect(user)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-gray-700 font-bold">
                      {initials}
                    </div>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    {last?.content && (
                      <p className="text-sm text-gray-700 truncate w-44">
                        {last.content}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {last?.timestamp && (
                    <p className="text-xs text-gray-400">
                      {new Date(last.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  {unreadCounts[user._id] > 0 && (
                    <div className="mt-1 flex justify-end">
                      <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCounts[user._id]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
