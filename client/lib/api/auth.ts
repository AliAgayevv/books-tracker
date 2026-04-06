import type { User } from "@books-tracker/shared";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Request failed");
  }

  return body.data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<User> {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; twoFactorRequired: boolean } | { twoFactorRequired: true }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body: ApiResponse<{ twoFactorRequired: boolean } & Partial<User>> = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Login failed");
  }

  return body.data as { user: User; twoFactorRequired: boolean };
}

export async function verifyTwoFactor(token: string): Promise<User> {
  return request<User>("/api/auth/2fa/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function logout(): Promise<void> {
  await request<null>("/api/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<User> {
  return request<User>("/api/auth/me");
}
