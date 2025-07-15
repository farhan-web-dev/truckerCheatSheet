// lib/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  LoginPayload,
  updatePassword,
  UpdatePasswordPayload,
} from "@/lib/api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordPayload) => updatePassword(data),
  });
};
