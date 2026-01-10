
import { SignUpRequest } from "../types/auth"
import axiosInstance from "./axiosInstance";

export const authService = {
  // 회원 가입
  signUp: async (data: SignUpRequest) : Promise<void> => {
    await axiosInstance.post('/auth/register', data);
  },

  // 로그인
  // login: async (data: LoginRequest): Promise<AuthResponse> => {
  //   // 응답 객체에 token과 user 정보가 포함되어 있다고 가정
  //   const response = await axiosInstance.post<AuthResponse>('/users/login', data);
  //   return response.data;
  // }
};
