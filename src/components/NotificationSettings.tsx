"use client";

import React from "react";
import { Switch } from "@headlessui/react";
import { useGetNotificationSettings } from "@/hooks/useGetNotificationSettings";
import { useUpdateNotificationSettings } from "@/hooks/useUpdateNotification";

const notificationsList = [
  {
    key: "emailNotifications",
    name: "Email Notifications",
    description: "Receive notifications via email",
  },
  {
    key: "pushNotifications",
    name: "Push Notifications",
    description: "Receive browser push notifications",
  },
  {
    key: "smsNotifications",
    name: "SMS Notifications",
    description: "Receive SMS text messages",
  },
  {
    key: "expenseAlerts",
    name: "Expense Alerts",
    description: "Get notified about new expense submissions",
  },
  {
    key: "fleetAlerts",
    name: "Fleet Alerts",
    description: "Receive alerts about fleet activities",
  },
  {
    key: "systemUpdates",
    name: "System Updates",
    description: "Get notified about system updates",
  },
];

const NotificationSettings = () => {
  const { data: settings, isLoading } = useGetNotificationSettings();
  const { mutate: updateSetting } = useUpdateNotificationSettings();

  if (isLoading) return <p className="text-gray-300">Loading...</p>;

  const toggleSetting = (key: string) => {
    const currentValue = settings[key];
    updateSetting({ [key]: !currentValue });
  };

  return (
    <div className="bg-[#1c2434] text-gray-200 p-4 sm:p-6 rounded-md w-full mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-6">
        {notificationsList.map((item) => (
          <div
            key={item.key}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
          >
            <div>
              <p className="font-medium text-gray-100 text-sm sm:text-base">
                {item.name}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                {item.description}
              </p>
            </div>

            <Switch
              checked={settings[item.key]}
              onChange={() => toggleSetting(item.key)}
              className={`${
                settings?.[item.key] ? "bg-blue-600" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 mt-2 sm:mt-0`}
            >
              <span
                className={`${
                  settings[item.key] ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
