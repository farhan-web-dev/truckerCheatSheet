"use client";
import { useUpdatePassword } from "@/hooks/useLogin";
import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const {
    mutate: updatePasswordMutate,
    isPending,
    error,
  } = useUpdatePassword();

  const handleChangePassword = () => {
    console.log("Changing password...");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    updatePasswordMutate(
      {
        currentPassword,
        password: newPassword,
        confirmPassword: confirmNewPassword,
      },
      {
        onSuccess: () => {
          alert("Password updated successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        },
        onError: (err: any) => {
          alert(err.message || "Error updating password");
        },
      }
    );
  };

  return (
    <div className="bg-[#0f172a] p-6 rounded-md space-y-6">
      <h2 className="text-white text-lg font-semibold">Change Password</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-[#1e293b] border border-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#1e293b] border border-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full bg-[#1e293b] border border-[#334155] text-white px-4 py-2 rounded-md focus:outline-none"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Change Password
        </button>
      </div>

      <div className="bg-[#1e293b] p-4 rounded-md text-sm text-white space-y-1">
        <h3 className="font-semibold mb-2">Security Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Use a strong password with at least 8 characters</li>
          <li>Include uppercase, lowercase, numbers, and symbols</li>
          <li>Don&apos;t reuse passwords from other accounts</li>
          <li>Enable two-factor authentication when available</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
