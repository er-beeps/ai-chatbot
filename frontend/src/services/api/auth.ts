import { apiClient } from "./client";
import type { AuthTokens, User } from "../../types/auth";

type AuthPayload = {
  username: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  email: string;
};

type LoginResponse = {
  access?: string;
  refresh?: string;
  user?: User;
  results?: {
    access?: string;
    refresh?: string;
    user?: User;
  };
};

function normalizeLoginResponse(data: LoginResponse): { tokens: AuthTokens; user: User } {
  const access = data.access ?? data.results?.access;
  const refresh = data.refresh ?? data.results?.refresh;
  const user = data.user ?? data.results?.user;

  if (!access || !refresh || !user) {
    throw new Error("Invalid login response shape from backend.");
  }

  return {
    tokens: { access, refresh },
    user,
  };
}

export async function login(payload: AuthPayload) {
  const endpoint = import.meta.env.VITE_LOGIN_ENDPOINT ?? "/auth/login/";
  const { data } = await apiClient.post<LoginResponse>(endpoint, payload);
  return normalizeLoginResponse(data);
}

export async function register(payload: RegisterPayload) {
  const endpoint = import.meta.env.VITE_REGISTER_ENDPOINT ?? "/auth/register/";
  return apiClient.post(endpoint, payload);
}

export async function fetchProfile() {
  const endpoint = import.meta.env.VITE_PROFILE_ENDPOINT ?? "/auth/user/";
  const { data } = await apiClient.get<User>(endpoint);
  return data;
}

export async function logout() {
  const endpoint = import.meta.env.VITE_LOGOUT_ENDPOINT ?? "/auth/logout/";
  return apiClient.post(endpoint);
}

export async function googleLogin(payload: { code: string }) {
  const { data } = await apiClient.post<LoginResponse>("/auth/google/", payload);
  return normalizeLoginResponse(data);
}

export async function changePassword(payload: { password: string; confirm_password: string }) {
  const endpoint = import.meta.env.VITE_PASSWORD_CHANGE_ENDPOINT ?? "/auth/password-change/";
  return apiClient.post(endpoint, payload);
}
