// lib/api/auth.ts
import { BASE_URL } from "@/lib/url";
export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await fetch(`${BASE_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Login failed");
  }

  const json = await response.json();
  console.log("Login success:", json);

  return json; // typically contains user + token
};
