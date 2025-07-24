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
  // console.log("data", json?.data);
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

export type UpdateUserData = {
  name?: string;
  email?: string;
  gpsTracking?: "enable" | "disable";
  role?: "driver" | "admin";
  assignedTruck?: string;
  profileUrl?: File | null;
};
export const updateUser = async (updatedData: FormData) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/updateme`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: updatedData, // ✅ send FormData directly
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update user");
  }

  return res.json();
};

export const updateUserWithId = async (id: string, updatedData: FormData) => {
  // console.log("Sending update to backend:", id, updatedData);
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // important
    },
    body: JSON.stringify(updatedData), // send as JSON
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update user");
  }

  return res.json();
};

export const deleteUserWithId = async (id: string) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    try {
      const error = await res.json(); // only try if it's not 204
      throw new Error(error.message || "Failed to delete user");
    } catch {
      throw new Error("Failed to delete user");
    }
  }

  // 204 = No Content → return manually
  return { message: "User deleted successfully" };
};

export const sendGpsRequestEmail = async (email: string) => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/send-gps-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send GPS request email");
  }

  return res.json();
};

export const generateDriverQrCode = async (): Promise<{ qrCode: string }> => {
  const token = getCookie("authToken");

  const res = await fetch(`${BASE_URL}/api/v1/users/generate-qr`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to generate QR code");
  }

  return res.json();
};
