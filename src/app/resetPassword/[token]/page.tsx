// app/resetPassword/[token]/page.tsx
"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truckercheatsheet.com";

interface Props {
  params: Promise<{ token: string }>;
}

type ToastType = "success" | "error";

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-sm max-w-xs ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {message}
    </div>
  );
};

export default function ResetWithTokenPage({ params }: Props) {
  const { token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>("success");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSuccess =
    typeof status === "string" && status.toLowerCase().includes("successful");

  const displayToast = (msg: string, type: ToastType) => {
    setStatus(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!token) {
      displayToast("Missing token.", "error");
      return;
    }
    if (password !== confirmPassword) {
      displayToast("Passwords do not match.", "error");
      return;
    }
    if (password.length < 8) {
      displayToast("Password must be at least 8 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/users/resetPassword/${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );
      const data = await res.json();

      console.log("resetPassword response:", res.status, data);

      if (res.ok) {
        displayToast("Password reset successful.", "success");
        // do NOT redirect; stays on page
      } else {
        let message = "Reset failed.";
        if (typeof data === "string") {
          message = data;
        } else if (data.error) {
          message = data.error;
        } else if (data.message) {
          message = data.message;
        } else if (data.errors && Array.isArray(data.errors)) {
          message = data.errors
            .map((e: any) => e.msg || JSON.stringify(e))
            .join(", ");
        }
        displayToast(message, "error");
      }
    } catch (err) {
      console.error(err);
      displayToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
        {showToast && status && (
          <Toast
            message={status}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
        <div className="max-w-md w-full bg-[#1f2a44] rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Reset Password
          </h2>
          <p className="text-sm text-gray-300 mb-4 break-words">
            {token ? (
              <>
                Enter your new password for token:{" "}
                <code className="text-xs">{token}</code>
              </>
            ) : (
              <>Invalid or missing reset link.</>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#e9f0ff]/10 placeholder:text-gray-400 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#e9f0ff]/10 placeholder:text-gray-400 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-60"
            >
              {loading ? "Resetting...." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}
