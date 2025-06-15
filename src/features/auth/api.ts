import axios from "axios";
import { LoginPayload, RegisterPayload, AuthResponse, FailedRequest, APIError, RefreshPayload } from "@/types/types";

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const api = axios.create({
    baseURL: "https://seedlet-api.onrender.com/api/v1",
    headers: {
        "Content-Type" : "application/json",
    }
});

//Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Handler function for failedQueue
const processQueue = (error: APIError | null | unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

//Response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers["Authorization"] = "Bearer " + token;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await refresh({refreshToken});

                const newAccessToken = res.token;
                localStorage.setItem("token", newAccessToken);

                api.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

//Fetch data
export const fetchAppData = async () => {
    const res = await api.get("/");
    return res.data;
};

//Register or signup
export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
        const res = await api.post("/auth/register", data);
        return res.data;
    }

//Login
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

//Refresh
export const refresh = async (data: RefreshPayload): Promise<AuthResponse> => {
    const res = await axios.post("/auth/refresh", data);
    return res.data;
}

export default api;