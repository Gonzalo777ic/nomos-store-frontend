import { create } from "zustand";




interface AuthState {

  isAuthReady: boolean;
  setIsAuthReady: (ready: boolean) => void;
}



export const useAuthStore = create<AuthState>()(
    (set) => ({
      isAuthReady: false,
      setIsAuthReady: (ready) => set({ isAuthReady: ready }),
    })
);


