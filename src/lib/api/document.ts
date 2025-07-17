// lib/api/documentApi.ts
import { BASE_URL } from "@/lib/url";
import { getCookie } from "cookies-next";

const getAuthHeaders = (): Record<string, string> => {
  const token = getCookie("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ⬇️ Upload Document
export const uploadDocument = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/api/v1/documents/upload-document`, {
    method: "POST",
    body: formData,
    headers: {
      ...getAuthHeaders(), // ✅ Add auth token
    },
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
};

// ⬇️ Fetch All Documents
export const fetchDocuments = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/documents`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // ✅ Add auth token
    },
  });

  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

// ⬇️ Delete Document
export const deleteDocument = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/documents/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(), // ✅ Add auth token
    },
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};

// ⬇️ Fetch Documents by Truck ID
export const fetchDocumentsByTruckId = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/documents/truck/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // ✅ Add auth token
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Documents for truck not found");
  }

  const json = await res.json();
  // console.log("Documents for truck:", json);
  return json.documents || [];
};
