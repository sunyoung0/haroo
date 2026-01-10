import { ChangeEvent, useState, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../../api/authService"; // 분리했던 서비스
import { SignUpRequest } from "../../types/auth"; // 정의했던 타입
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 1. 폼 데이터 상태 (passwordCheck 포함)
  const [signUp, setSignUp] = useState<
    SignUpRequest & { passwordCheck: string }
  >({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  // 2. 에러 메시지 상태
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordCheck: "",
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

  // 정규식 설정
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|-]).{8,}$/;

  // 비밀번호 일치 실시간 검사
  useEffect(() => {
    if (signUp.password && signUp.passwordCheck) {
      const match = signUp.password === signUp.passwordCheck;
      setErrors((prev) => ({
        ...prev,
        passwordCheck: match ? "" : "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, passwordCheck: "" }));
    }
  }, [signUp.password, signUp.passwordCheck]);

  // 입력값 변경 핸들러
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUp((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    // 유효성 검사
    if (event.target.name === "email") {
      setErrors((prev) => ({
        ...prev,
        email:
          !event.target.value || emailRegex.test(event.target.value)
            ? ""
            : "올바른 이메일 형식이 아닙니다.",
      }));
    }
    if (event.target.name === "password") {
      setErrors((prev) => ({
        ...prev,
        password:
          !event.target.value || passwordRegex.test(event.target.value)
            ? ""
            : "8자 이상, 영문/숫자/특수문자 포함 필수입니다.",
      }));
    }
    if (event.target.name === "nickname") {
      setErrors((prev) => ({
        ...prev,
        nickname:
          !event.target.value || (event.target.value.length >= 2 && event.target.value.length <= 10)
            ? ""
            : "닉네임은 2~10자 사이여야 합니다.",
      }));
    }
  };

  // 모든 조건 충족 확인
  const isFormValid =
    emailRegex.test(signUp.email) &&
    passwordRegex.test(signUp.password) &&
    signUp.password === signUp.passwordCheck &&
    signUp.nickname.length >= 2 &&
    !errors.email &&
    !errors.password &&
    !errors.passwordCheck &&
    !errors.nickname;

  // 회원가입 실행
  const handleSave = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      // passwordCheck는 빼고 백엔드에 전송
      const submitData = {
        email: signUp.email,
        password: signUp.password,
        nickname: signUp.nickname,
      };
      await authService.signUp(submitData);

      alert("회원가입이 완료되었습니다!");
      navigate("/auth/login"); // 로그인 페이지로 이동
    } catch (error: unknown) {
      console.error("회원가입 실패:", error);

      let message = "회원가입에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        // 서버에서 보낸 에러 메시지가 있으면 그것을 사용, 없으면 기본 메시지
        message =
          error.response?.data?.message ||
          (error.response?.status === 409
            ? "이미 가입된 이메일입니다."
            : message);
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            onChange={handleChange}
          />
        </div>
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
            placeholder="비밀번호를 입력하세요"
            className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
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
        {/* 에러 메시지 */}
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
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
            placeholder="닉네임을 입력하세요"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <button
        type="button"
        className="w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        onClick={handleSave}
      >
        Sign Up
      </button>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-sm text-sky-600 hover:text-sky-700"
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </div>
    </form>
  );
}

export default SignUp;
