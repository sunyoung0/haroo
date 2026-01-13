import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  nickname: string | null;
  isLoggedIn: boolean;

  // 액션들
  login: (token: string, email: string, nickname: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>() (
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      nickname: null,
      isLoggedIn: false,

      login: (token, email, nickname) =>
        set({
          token,
          userEmail: email,
          nickname,
          isLoggedIn: true
        }),

        logout: () => set({
          token: null,
          userEmail: null,
          nickname: null,
          isLoggedIn: false
        }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
    }
  )
)