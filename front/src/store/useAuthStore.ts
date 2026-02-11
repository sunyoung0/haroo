import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  userId: number | null;
  nickname: string | null;
  profileImage: string | null;
  isLoggedIn: boolean;

  // 액션들
  login: (token: string, email: string, userId: number, nickname: string) => void;
  logout: () => void;
  setNickname: (nickname: string) => void;  // 닉네임만 업데이트
  setProfileImage: (profileImage: string | null) => void;
}

export const useAuthStore = create<AuthState>() (
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      userId: null,
      nickname: null,
      profileImage: null,
      isLoggedIn: false,

      setNickname: (nickname) => set({ nickname }),
      setProfileImage: (profileImage) => set({ profileImage}),

      login: (token, email, userId, nickname) =>
        set({
          token,
          userEmail: email,
          userId,
          nickname,
          isLoggedIn: true
        }),

        logout: () => set({
          token: null,
          userEmail: null,
          userId: null,
          nickname: null,
          profileImage: null,
          isLoggedIn: false
        }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
    }
  )
)