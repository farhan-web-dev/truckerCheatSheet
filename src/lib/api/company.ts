import { BASE_URL } from "../url";

export const addCompany = async (data: any) => {
  const res = await fetch(`http://localhost:5000/api/v1/company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add company");
  }

  return res.json();
};
