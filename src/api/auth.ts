import { api, setToken } from './client';

export interface AuthUser {
  user_id: string;
  email: string;
  full_name?: string | null;
  role: string;
  company_id: string;
  company_name: string;
  plan_tier?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  company_id: string;
  company_name: string;
  role: string;
  email: string;
}

const USER_KEY = 'candy.user';

export function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function storeUser(u: AuthUser | null) {
  try {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else   localStorage.removeItem(USER_KEY);
  } catch {}
}

export async function login(email: string, password: string): Promise<{ token: TokenResponse; user: AuthUser }> {
  const tok = await api<TokenResponse>('/v1/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
  setToken(tok.access_token);
  const user = await me();
  storeUser(user);
  return { token: tok, user };
}

export async function signup(args: {
  company_name: string;
  email: string;
  password: string;
  full_name?: string;
}): Promise<{ token: TokenResponse; user: AuthUser }> {
  const tok = await api<TokenResponse>('/v1/auth/signup', {
    method: 'POST',
    auth: false,
    body: args,
  });
  setToken(tok.access_token);
  const user = await me();
  storeUser(user);
  return { token: tok, user };
}

export async function me(): Promise<AuthUser> {
  return api<AuthUser>('/v1/auth/me');
}

export function logout() {
  setToken(null);
  storeUser(null);
}
