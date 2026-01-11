import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserPlus } from "lucide-react"; // 아이콘 라이브러리

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* 로고 및 헤더 섹션 */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-sky-600 p-3 rounded-2xl shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-sky-900 mb-2 tracking-tight">
          Haroo
        </h1>
        <p className="text-gray-600 text-lg">당신의 하루를 기록하세요</p>
      </div>

      {/* 버튼 컨테이너 */}
      <div className="w-full max-w-sm space-y-4">
        {/* 로그인 버튼 */}
        <button
          onClick={() => navigate("/auth/login")}
          className="w-full flex items-center justify-center gap-2 py-4 bg-sky-600 text-white rounded-xl font-semibold shadow-md hover:bg-sky-700 transition-all active:scale-95"
        >
          <LogIn className="w-5 h-5" />
          로그인하기
        </button>

        {/* 회원가입 버튼 */}
        <button
          onClick={() => navigate("/auth/register")}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white text-sky-600 border-2 border-sky-100 rounded-xl font-semibold shadow-sm hover:border-sky-200 hover:bg-sky-50 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          회원가입하기
        </button>
      </div>

      {/* 푸터 안내 */}
      <p className="mt-12 text-sm text-gray-400">
        © 2024 Haroo Diary. All rights reserved.
      </p>
    </div>
  );
};

export default MainPage;