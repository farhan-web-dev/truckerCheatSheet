import { useMutation, useQuery } from "@tanstack/react-query";
import { addCompany, getUserCompany } from "../lib/api/company";

// ✅ Hook to add a new company
export const useAddCompany = () => {
  return useMutation({
    mutationFn: addCompany,
  });
};

// ✅ Hook to get company info of the logged-in user
export const useUserCompany = () => {
  return useQuery({
    queryKey: ["userCompany"],
    queryFn: getUserCompany, // This auto-fetches using the user's companyDOTNumber from localStorage
  });
};
