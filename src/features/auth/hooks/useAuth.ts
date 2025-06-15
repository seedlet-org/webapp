import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api";
import type { LoginPayload, RegisterPayload, APIError, AuthResponse } from "@/types/types";
import { AxiosError } from "axios";

export function useLogin() {
  return useMutation<AuthResponse, AxiosError, LoginPayload>({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation<AuthResponse, APIError, RegisterPayload>({
    mutationFn: register,
  });
}
