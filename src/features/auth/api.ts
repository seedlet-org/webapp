import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/types";
import apiRequest from "@/utils/api";

//Register or signup
export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/register", data);
  return res.data;
};

//Login
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/login", data);
  return res.data;
};

//Refresh
export const refresh = async (): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/refresh");
  return res.data;
};
