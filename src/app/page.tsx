"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login.mutateAsync({ email, password });

      // ✅ Example: save token to cookie
      setCookie("authToken", data.token);

      // redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-[#1f2937] p-8 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 py-2 rounded">
          {login.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
