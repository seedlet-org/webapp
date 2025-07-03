import axios from "axios";
import { FailedRequest, APIError } from "@/types/types";
import { refresh } from "@/features/auth/api";
import { toast } from "sonner";

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const apiRequest = axios.create({
  baseURL: "https://seedlet-api.onrender.com/api/v1",
});

//Request interceptor
apiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Handler function for failedQueue
const processQueue = (
  error: APIError | null | unknown,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

//Response interceptor
apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      const retryAfterHeader = error.response?.headers["retry-after"] || 60;
      const retryAfter = Number(retryAfterHeader);

      toast.error(
        `Too many requests. Please try again after ${retryAfter} seconds.`,
        { duration: 8000 }
      );

      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return apiRequest(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refresh();

        const newAccessToken = res.data.access_token;
        localStorage.setItem("token", newAccessToken);

        apiRequest.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);
        return apiRequest(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiRequest;
