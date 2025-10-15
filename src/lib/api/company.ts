import { BASE_URL } from "../url";

export const addCompany = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/v1/company`, {
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

export const getUserCompany = async () => {
  // 🔹 Get the companyDOTNumber of the logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const companyDOTNumber = user?.companyDOTNumber;

  if (!companyDOTNumber) {
    throw new Error("Company DOT number not found for the logged-in user");
  }

  const res = await fetch(`${BASE_URL}/api/v1/company/${companyDOTNumber}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch company info");
  }

  const data = await res.json();

  return data?.data;
};
