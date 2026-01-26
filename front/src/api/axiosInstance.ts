import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 요청 인터셉터 : 모든 요청 전에 실행됨
api.interceptors.request.use((config) => {
  // Zustand 스토어에서 현재 토큰을 가져옴
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 200번대 응답은 그냥 통과
    return response;
  },
  (error) => {
    const token = useAuthStore.getState().token;
    // 서버가 아예 꺼져있거나(Network Error) / 인증에러(401) / 서버 내부 에러(500)이 발생한 경우
    if (token && (
      !error.response ||
      error.response.status === 401 ||
      error.response.status === 500
    )) {
      // 로그아웃 로직 실행
      useAuthStore.getState().logout();

      // 메인으로 강제 이동
      window.location.href = "/";

      console.error("로그아웃 되었습니다.");
    }
    return Promise.reject(error);
  },
);

export default api;
