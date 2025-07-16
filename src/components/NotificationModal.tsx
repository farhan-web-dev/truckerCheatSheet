"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import { useMarkNotificationRead } from "@/hooks/useNotification";
import { Dialog } from "@headlessui/react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Mark unread notifications as read when modal opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      unreadNotifications.forEach((n) => markAsRead(n._id));
    }
  }, [isOpen]);

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
        <Bell className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl text-black">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Notifications
            </Dialog.Title>

            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications found.</p>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {unreadNotifications.map((note) => (
                  <li
                    key={note._id}
                    className={`p-3 rounded shadow ${
                      note.isRead ? "bg-gray-100" : "bg-blue-50"
                    }`}
                  >
                    <h4 className="font-medium">{note.title}</h4>
                    <p className="text-sm text-gray-700">{note.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
