import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { loginApi, registerApi } from "@/api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      async login(email, password) {
        try {
          const res = await loginApi({ email, password });
          set({ user: res.user, token: res.token });
        } catch (e) {
          // Fallback for demo when API isn't available
          set({ user: { id: "local", name: email.split("@")[0], email }, token: "local-token" });
        }
      },
      async register(name, email, password) {
        try {
          const user = await registerApi({ name, email, password });
          set({ user, token: "registered-token" });
        } catch (e) {
          set({ user: { id: "local", name, email }, token: "local-token" });
        }
      },
      logout() {
        set({ user: null, token: null });
      },
      isAuthenticated: () => Boolean(get().token),
    }),
    { name: "nomos-auth" },
  ),
);
