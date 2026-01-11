import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import AuthLayOut from "./AuthLayout";
import { useSnackbar } from "../../context/SnackbarContext";

type SignUp = {
  email: string;
  password: string;
  nickname: string;
};
function SignUp() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기 true/false

  const [signUp, setSignUp] = useState<SignUp>({
    email: "",
    password: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    }
  };

  // 이메일, 비밀번호 조건 설정
  // 1. 도메인 끝(TLD)이 최소 2자 이상 (예: .com, .kr, .net)
  // 2. 숫자로만 된 도메인 끝자리 방지
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]).{8,}$/;

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // 값이 비어있으면 검사하지 않고 리턴 (필수값 체크는 handleSave에서 수행)
    if (!value) return;

    if (name === "email") {
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "올바른 이메일 형식이 아닙니다. (예: user@example.com)",
        }));
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.",
        }));
      }
    }

    if (name === "nickname") {
      if (value.length < 2 || value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          nickname: "닉네임은 2~10자 사이여야 합니다.",
        }));
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUp({ ...signUp, [event.target.name]: event.target.value });

    // 사용자가 타이핑을 시작하면 해당 필드의 빨간 에러 메시지를 즉시 지워줌
    if (errors[event.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const handleSave = async () => {
    // 모든 조건 통과 확인 ( 유효성 검사 )
    if (errors.email || errors.password || errors.nickname) {
      showSnackbar("조건이 맞지 않습니다. 다시 확인해주세요.", "warning");
      return;
    }
    if (!signUp.email || !signUp.password || !signUp.nickname) {
      showSnackbar("모든 필드를 입력해주세요.", "warning");
      return;
    }

    try {
      const userData = {
        email: signUp.email,
        password: signUp.password,
        nickname: signUp.nickname,
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        userData
      );
      showSnackbar("회원가입 성공! 로그인 페이지로 이동합니다.", "success");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error) {
      console.error("회원가입 실패 : ", error);

      // Axios 에러인지 확인하는 타입 가드
      if (axios.isAxiosError(error)) {
        // 이 안에서 error를 AxiosError 타입으로 인식
        const serverMessage =
          error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 409) {
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
    <AuthLayOut title="회원가입" subtitle="함께 추억을 기록해요">
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={signUp.email}
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

        {/* Password Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Password</label>
          <div className="relative">
            {/* 왼쪽 자물쇠 아이콘 */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={signUp.password}
              onChange={handleChange}
              onBlur={handleBlur}
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
              {errors.password}
            </p>
          )}
        </div>

        {/* Nickname Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Nickname</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={signUp.nickname}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="닉네임을 입력하세요"
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                errors.nickname ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.nickname && (
            <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">
              {errors.nickname}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
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
      </div>
    </AuthLayOut>
  );
}

export default SignUp;
