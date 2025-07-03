import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api";
import apiRequest from "@/utils/api";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getUserProfile,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await apiRequest.get(`/users/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
