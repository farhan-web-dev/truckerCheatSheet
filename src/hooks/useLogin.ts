// lib/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginUser, LoginPayload } from "@/lib/api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};
