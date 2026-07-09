export type User = {
  id?: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
