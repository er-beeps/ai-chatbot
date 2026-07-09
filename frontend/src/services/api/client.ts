import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../../utils/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const REFRESH_ENDPOINT = import.meta.env.VITE_REFRESH_ENDPOINT ?? "/auth/token/refresh/";

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const tokens = tokenStorage.getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const refreshToken = tokenStorage.getTokens()?.refresh;
    const hasUnauthorizedError = error.response?.status === 401;

    if (!originalRequest || !hasUnauthorizedError || !refreshToken || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}${REFRESH_ENDPOINT}`,
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      const newAccess = refreshResponse.data?.access;
      if (!newAccess) throw new Error("No access token returned from refresh endpoint");

      const existing = tokenStorage.getTokens();
      if (existing) tokenStorage.setTokens({ ...existing, access: newAccess });

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearAll();
      return Promise.reject(refreshError);
    }
  },
);
