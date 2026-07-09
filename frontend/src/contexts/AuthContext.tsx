import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchProfile, googleLogin as googleLoginApi, login as loginApi, logout as logoutApi, register as registerApi } from "../services/api/auth";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthState } from "../types/auth";

type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

type LoginValues = {
  username: string;
  password: string;
};

type AuthContextValue = AuthState & {
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
};

const initialState: AuthState = {
  user: tokenStorage.getUser(),
  tokens: tokenStorage.getTokens(),
  isLoading: true,
  isAuthenticated: Boolean(tokenStorage.getTokens()),
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore backend logout errors to keep UX predictable.
    } finally {
      tokenStorage.clearAll();
      setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const syncProfile = useCallback(async () => {
    try {
      const profile = await fetchProfile();
      tokenStorage.setUser(profile);
      setState((prev) => ({ ...prev, user: profile, isAuthenticated: true }));
    } catch {
      await logout();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [logout]);

  useEffect(() => {
    if (!tokenStorage.getTokens()) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    void syncProfile();
  }, [syncProfile]);

  const login = useCallback(async (values: LoginValues) => {
    const { tokens, user } = await loginApi(values);
    tokenStorage.setTokens(tokens);
    tokenStorage.setUser(user);
    setState({ user, tokens, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (values: RegisterValues) => {
    await registerApi(values);
  }, []);

  const googleLogin = useCallback(async (code: string) => {
    const { tokens, user } = await googleLoginApi({ code });
    tokenStorage.setTokens(tokens);
    tokenStorage.setUser(user);
    setState({ user, tokens, isAuthenticated: true, isLoading: false });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      googleLogin,
    }),
    [state, login, register, logout, googleLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
