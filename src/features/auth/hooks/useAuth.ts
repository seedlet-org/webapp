import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAppData, login, register } from "../api";
import type { LoginPayload, RegisterPayload, APIError, AuthResponse } from "@/types/types";

export function useAppData() {
    return useQuery({
        queryKey: ["appData"],
        queryFn: fetchAppData,
    })
}

export function useLogin() {
    return useMutation<AuthResponse, APIError, LoginPayload>({
        mutationFn: login,
    });
};

export function useRegister() {
    return useMutation<AuthResponse, APIError, RegisterPayload>({
        mutationFn: register,
    });
};