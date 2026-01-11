import { Mail, Lock} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayOut from "./AuthLayout";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 백엔드 API 호출 로직 (로그인)
    console.log("회원가입 시도");
  };

  return (
    <AuthLayOut title="나의 다이어리" subtitle="매일의 소중한 순간을 기록하세요">
    <div className="space-y-4" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>
      {/* Password Input*/}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
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
