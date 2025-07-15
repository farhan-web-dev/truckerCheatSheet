// NotificationSettings.tsx
import React, { useState } from "react";
import { Switch } from "@headlessui/react";

const notificationsList = [
  {
    id: 1,
    name: "Email Notifications",
    description: "Receive notifications via email",
  },
  {
    id: 2,
    name: "Push Notifications",
    description: "Receive browser push notifications",
  },
  {
    id: 3,
    name: "SMS Notifications",
    description: "Receive SMS text messages",
  },
  {
    id: 4,
    name: "Expense Alerts",
    description: "Get notified about new expense submissions",
  },
  {
    id: 5,
    name: "Fleet Alerts",
    description: "Receive alerts about fleet activities",
  },
  {
    id: 6,
    name: "System Updates",
    description: "Get notified about system updates",
  },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    1: true,
    2: true,
    3: false,
    4: true,
    5: true,
    6: false,
  });

  const toggleSetting = (id: number) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    // Handle backend update here (e.g., via fetch or axios)
  };

  return (
    <div className="bg-[#1c2434] text-gray-200 p-6 rounded-md w-full  mx-auto text-md">
      <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        {notificationsList.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-100">{item.name}</p>
              <p className="text-gray-400 text-xs">{item.description}</p>
            </div>
            <Switch
              checked={settings[item.id]}
              onChange={() => toggleSetting(item.id)}
              className={`${
                settings[item.id] ? "bg-blue-600" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
            >
              <span
                className={`${
                  settings[item.id] ? "translate-x-6" : "translate-x-1"
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
