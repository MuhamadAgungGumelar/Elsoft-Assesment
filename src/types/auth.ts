export interface LoginPayload {
  domain: string;
  username: string;
  password: string;
}

export interface AuthUser {
  Oid: string;
  UserName: string;
  FullName: string;
  Company: string;
  CompanyName: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
