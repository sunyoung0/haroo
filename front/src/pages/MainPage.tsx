import { Plus, LogOut, User, Calendar } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const { userEmail, nickname, logout } = useAuthStore();

  const handleLogout = () => {
    // Zustand의 logout 실행 -> 상태 초기화 및 LocalStorage 삭제가 동시에 일어남
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 영역 */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              <Calendar className="w-6 h-6" />
            </span>
          </div>
          <h1 className="text-xl font-bold text-sky-600 tracking-tight">
            {nickname || "User"} 님의 다이어리
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* 사용자 정보 표시 */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>{userEmail || "User"}</span>
          </div>
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="로그아웃"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* --- 메인 컨텐츠 영역 --- */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            나의 다이어리 목록
          </h2>
          <p className="text-slate-500 font-medium">
            다이어리를 선택하여 기록을 시작하세요
          </p>
        </div>

        {/* 다이어리 그리드 (목록이 들어갈 자리) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 다이어리 만들기 카드 (이미지에 있던 점선 박스) */}
          <button className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-400 hover:bg-white transition-all min-h-[240px]">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-purple-500" />
            </div>
            <span className="text-lg font-semibold text-slate-500 group-hover:text-purple-600">
              새 다이어리 만들기
            </span>
          </button>

          {/* 여기에 나중에 다이어리 아이템들이 추가됩니다. */}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
