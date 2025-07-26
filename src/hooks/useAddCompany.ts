import { useMutation } from "@tanstack/react-query";
import { addCompany } from "../lib/api/company";

export const useAddCompany = () => {
  return useMutation({
    mutationFn: addCompany,
  });
};
