import http from "./http";
import type { User, AuthResponse, Credentials, RegisterInput } from "@/types";

export async function loginApi(data: Credentials): Promise<AuthResponse> {
  const res = await http.post<AuthResponse>("/auth/login", data);
  return res.data;
}

export async function registerApi(data: RegisterInput): Promise<User> {
  const res = await http.post<User>("/auth/register", data);
  return res.data;
}
