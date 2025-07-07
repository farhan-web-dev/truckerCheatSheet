import { useQuery } from "@tanstack/react-query";
import { fetchLoginUser, fetchUser } from "@/lib/api/user";

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
