import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteUserWithId,
  fetchLoginUser,
  fetchUser,
  generateDriverQrCode,
  sendGpsRequestEmail,
  updateUser,
  UpdateUserData,
  updateUserWithId,
  generateLink,
} from "@/lib/api/user";
import { userAgent } from "next/server";

export const useUserVeiw = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUser,
    staleTime: 1000 * 60,
  });
};

export const useLoginUserVeiw = () => {
  return useQuery({
    queryKey: ["loginuser"],
    queryFn: fetchLoginUser,
    staleTime: 1000 * 60,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ updatedData }: { updatedData: FormData }) =>
      updateUser(updatedData),
  });
};
export const useGenerateConnectLink = (id: string) => {
  return useQuery({
    queryKey: ["generate-connect-link", id],
    queryFn: () => generateLink(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};

export const useUpdateUserWithId = () => {
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: FormData }) =>
      updateUserWithId(id, updatedData),
  });
};

export const useDeleteUserWithId = () => {
  return useMutation({
    mutationFn: (id: string) => deleteUserWithId(id),
  });
};
export const useSendGpsRequest = () => {
  return useMutation({
    mutationFn: (email: string) => sendGpsRequestEmail(email),
  });
};

export const useGenerateQrCode = () => {
  return useQuery({
    queryKey: ["generate-driver-qr"],
    queryFn: generateDriverQrCode,
    staleTime: Infinity,
  });
};
