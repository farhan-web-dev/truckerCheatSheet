"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Settings, User } from "lucide-react";
import { useUpdateUser, useLoginUserVeiw } from "@/hooks/useUser";
import NotificationSettings from "@/components/NotificationSettings";
import ChangePassword from "@/components/ChangePassword";
import AdminPreferences from "@/components/AdminPrefrences";
import toast from "react-hot-toast";
import ClientOnly from "@/components/ClientOnly";

const tabs = [
  { name: "Profile Settings", icon: <User className="w-4 h-4 mr-2" /> },
  { name: "Notifications", icon: <Bell className="w-4 h-4 mr-2" /> },
  { name: "Security", icon: <Shield className="w-4 h-4 mr-2" /> },
  { name: "Preferences", icon: <Settings className="w-4 h-4 mr-2" /> },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: loginUser } = useLoginUserVeiw();
  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    if (loginUser) {
      setName(loginUser.name || "");
      setEmail(loginUser.email || "");
    }
  }, [loginUser]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePhoto(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (profilePhoto) {
      formData.append("profileUrl", profilePhoto);
    }

    updateUser(
      { updatedData: formData },
      {
        onSuccess: () => {
          toast.success("✅ Profile updated successfully!");
          setProfilePhoto(null);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "❌ Failed to update profile.";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <ClientOnly>
      <div className="bg-[#0f172a] min-h-screen p-2 md:p-6 text-white">
        <div className="mx-auto  bg-[#1e293b] p-6  rounded-lg shadow-lg">
          <h1 className="text-xl md:text-3xl font-bold mb-1">
            Fleet Manager Settings
          </h1>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            Manage your admin profile, notifications, and preferences
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-600 mb-6 gap-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center whitespace-nowrap px-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.name
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Profile Settings Tab */}
          {activeTab === "Profile Settings" && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Preview"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                    />
                  ) : loginUser?.profileUrl ? (
                    <img
                      src={loginUser.profileUrl}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold">
                      {name ? name[0].toUpperCase() : "A"}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="profile-upload"
                    className="text-blue-400 hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-upload"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <span>⬆️ Upload Photo</span>
                  </label>
                  <p className="text-sm text-gray-400">
                    Click photo or button to upload
                  </p>
                </div>
              </div>

              {/* Name & Email */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 w-full sm:w-auto"
              >
                {isPending ? "Updating..." : "Update Profile"}
              </button>
            </div>
          )}

          {activeTab === "Notifications" && <NotificationSettings />}
          {activeTab === "Security" && <ChangePassword />}
          {activeTab === "Preferences" && <AdminPreferences />}
        </div>
      </div>
    </ClientOnly>
  );
}
