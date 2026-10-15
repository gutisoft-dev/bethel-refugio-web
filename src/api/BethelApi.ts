import { useAuthStore } from "@/auth/store/auth.store";
import axios from "axios";

const BethelApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const AUTH_SKIP_URLS = ["/auth/token/refresh/", "/auth/logout/"];

BethelApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token-access");

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

BethelApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthSkipUrl = AUTH_SKIP_URLS.some((url) =>
      originalRequest.url?.includes(url),
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthSkipUrl
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => BethelApi(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("token-refresh");

      if (!refreshToken) {
        throw new Error("No existe un refresh token");
      }

      const { data } = await BethelApi.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });

      if (data.access) {
        localStorage.setItem("token-access", data.access);
      }

      if (data.refresh) {
        localStorage.setItem("token-refresh", data.refresh);
      }

      processQueue(null);
      return BethelApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      await useAuthStore.getState().logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { BethelApi };
