// 공통 설정
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 나중에 여기에 JWT 토큰을 자동으로 넣어주는 인터셉터를 추가할 수 있습니다.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;