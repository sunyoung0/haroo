import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import AuthLayOut from "./AuthLayout";
import { useSnackbar } from "../../context/SnackbarContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "../../utils/authValidation";
import { useErrorHandler } from "../../hooks/useErrorHandler";

function SignUp() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { errorHandler } = useErrorHandler();

  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  // 가입 처리
  const onSubmit = async (data: SignUpFormData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        data,
      );
      showSnackbar("회원가입 성공! 로그인 페이지로 이동합니다.", "success");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error) {
      errorHandler(error, "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <AuthLayOut title="회원가입" subtitle="함께 추억을 기록해요">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register("email")} // register가 name, value, onChange, onBlur를 자동 부여
              type="email"
              placeholder="email@example.com"
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <div className="relative">
            {/* 왼쪽 자물쇠 아이콘 */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
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
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Nickname Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Nickname</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register("nickname")}
              type="text"
              placeholder="닉네임을 입력하세요"
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.nickname ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.nickname && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">
              {errors.nickname.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          Sign Up
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </form>
    </AuthLayOut>
  );
}

export default SignUp;
