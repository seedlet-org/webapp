import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ResetPasswordPayload,
} from "@/types/types";
import apiRequest from "@/utils/api";
import { toast } from "sonner";

//Register or signup
export const register = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/register", data);
  return res.data;
};

//Login
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/login", data);
  return res.data;
};

//Logout
export const logout = async () => {
  try {
    await apiRequest.post("/auth/logout");
    localStorage.removeItem("token");
    toast("Logout successful");
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout failed:", error);
    toast("Logout failed. Try again.");
  }
};

//Refresh
export const refresh = async (): Promise<AuthResponse> => {
  const res = await apiRequest.post("/auth/refresh");
  return res.data;
};

//Otp
export const OTP = async (email: string): Promise<void> => {
  const res = await apiRequest.post("/auth/otp", { email });
  return res.data;
};

//Reset Password
export const ResetPassword = async (
  data: ResetPasswordPayload
): Promise<void> => {
  const res = await apiRequest.post("/auth/reset-password", data);
  return res.data;
};
