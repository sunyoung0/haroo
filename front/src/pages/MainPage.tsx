import { Plus, LogOut, User, Calendar } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CreateDiaryModal from "../components/diaryGroup/CreateDiaryModal";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { UsersIcon, Book } from "lucide-react";

type DiaryGroup = {
  id: number;
  title: string;
  type: "PERSONAL" | "SHARED";
  createdAt: string;
};

const MainPage = () => {
  const navigate = useNavigate();
  const { userEmail, nickname, logout } = useAuthStore();

  const [diaryGroups, setDiaryGroups] = useState<DiaryGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/groups");
      setDiaryGroups(response.data);
    } catch (error) {
      console.error("다이어리 목록 로딩 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []); // 컴포넌트 마운트 시 최초 1회 실행

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
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-700 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>{userEmail || "User"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="로그아웃"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              나의 다이어리 목록
            </h2>
            <p className="text-slate-500 font-medium">
              다이어리를 선택하여 기록을 시작하세요
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative border-2 border-dashed border-slate-200 rounded-2xl px-8 py-4 flex items-center gap-4 hover:border-sky-400 hover:bg-white transition-all min-h-[80px]"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-sky-50 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-sky-500" />
            </div>
            <span className="text-lg font-semibold text-slate-500 group-hover:text-sky-600">
              새 다이어리 만들기
            </span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 다이어리 목록 렌더링 */}
          {diaryGroups.map((diary) => (
            <div
              key={diary.id}
              onClick={() => navigate(`/diaries/${diary.id}`)} // 나중에 상세 페이지 이동용
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-2xl ${
                    diary.type === "SHARED"
                      ? "bg-sky-50 text-sky-600"
                      : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {diary.type === "SHARED" ? (
                    <UsersIcon className="w-6 h-6" />
                  ) : (
                    <Book className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    diary.type === "SHARED"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {diary.type === "SHARED" ? "그룹" : "개인"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                {diary.title}
              </h3>
            </div>
          ))}
        </div>
        {!loading && diaryGroups.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            아직 생성된 다이어리가 없습니다. 첫 번째 다이어리를 만들어보세요!
          </div>
        )}
      </main>
      <CreateDiaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDiaries}
      />
    </div>
  );
};

export default MainPage;
