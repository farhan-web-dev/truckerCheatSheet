import { getCookie } from "cookies-next";
import { BASE_URL } from "@/lib/url";

export const fetchUser = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch users");
  }

  const json = await res.json();
  return json.data.data;
};

export const fetchLoginUser = async () => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch user");
  }

  const json = await res.json();

  return json.data;
};
