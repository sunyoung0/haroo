import axios from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayOut from "./AuthLayout";
import { useSnackbar } from "../../context/SnackbarContext";
import { ChangeEvent, KeyboardEvent, useState } from "react";

type User = {
  email: "";
  password: "";
};

function LoginForm() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });

    // 사용자가 타이핑을 시작하면 해당 필드의 빨간 에러 메시지를 즉시 지워줌
    if (errors[event.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]).{8,}$/;

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // 값이 비어있으면 검사하지 않고 리턴 (필수값 체크는 handleSave에서 수행)
    if (!event.target.value) return;

    if (event.target.name === "email") {
      if (!emailRegex.test(event.target.value)) {
        setErrors((prev) => ({
          ...prev,
          email: "올바른 이메일 형식이 아닙니다. (예: user@example.com)",
        }));
      }
    }

    if (event.target.name === "password") {
      if (!passwordRegex.test(event.target.value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.",
        }));
      }
    }
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      showSnackbar("이메일과 비밀번호를 모두 입력해주세요.", "warning");
      return;
    }

    try {
      const userData = {
        email: user.email,
        password: user.password,
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        userData
      );
      showSnackbar("로그인에 성공했습니다.", "success");
      setTimeout(() => navigate("/"), 1500);
      console.log("Login Success:" + userData.email);
    } catch (error) {
      // Axios 에러인지 확인하는 타입 가드
      if (axios.isAxiosError(error)) {
        // 이 안에서 error를 AxiosError 타입으로 인식
        const serverMessage =
          error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 401) {
          showSnackbar(serverMessage, "warning");
        } else {
          // 400 Bad Request: 입력값 형식 오류 등
          showSnackbar(serverMessage, "warning");
        }
      } else {
        // 네트워크 에러나 코드 에러 등 Axios 에러가 아닌 경우
        showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <AuthLayOut
      title="나의 다이어리"
      subtitle="매일의 소중한 순간을 기록하세요"
    >
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="email"
              id="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="email@example.com"
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>
        {/* Password Input*/}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {/* 오른쪽 눈 모양 토글 버튼 */}
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-600 transition-colors"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" /> // 비밀번호 숨기기 아이콘
              ) : (
                <Eye className="w-5 h-5" /> // 비밀번호 보기 아이콘
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          Login
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/auth/register")}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>
    </AuthLayOut>
  );
}
export default LoginForm;
