import { Plus, LogOut, User, Calendar } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CreateDiaryModal from "../components/modals/CreateDiaryModal";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { UsersIcon, Book } from "lucide-react";
import { DiaryGroup } from "../types/types";

const MainPage = () => {
  const navigate = useNavigate();
  const { userEmail, nickname, logout } = useAuthStore();

  const [diaryGroups, setDiaryGroups] = useState<DiaryGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

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

  const handleLogout = () => {
    // Zustand의 logout 실행 -> 상태 초기화 및 LocalStorage 삭제가 동시에 일어남
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchDiaries();
  }, []); // 컴포넌트 마운트 시 최초 1회 실행

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      {/* 2. 실제 본문 박스: 너비를 최대 2xl(672px)로 제한하고 흰색 배경 설정 */}
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col">
        {/* 헤더 영역 */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-sky-500" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {nickname || "User"} 님의 다이어리
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-slate-500 text-xs font-semibold border border-slate-100">
              <User className="w-3.5 h-3.5" />
              <span>{userEmail || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 메인 컨텐츠 영역 */}
        <main className="max-w-4xl p-8">
          <div className="flex flex-col gap-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

            {/* 필터 탭 섹션: 전체 / 그룹 / 개인 */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 w-fit rounded-xl border border-slate-200">
              {[
                { id: "all", label: "전체 목록" },
                { id: "group", label: "그룹 다이어리" },
                { id: "private", label: "개인 다이어리" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)} // filter 상태 변경 함수
                  className={`
          px-5 py-2 rounded-lg text-sm font-bold transition-all
          ${
            filter === tab.id
              ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
          }
        `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 다이어리 목록 렌더링 */}
            {diaryGroups
              .filter((diary) => {
                if (filter === "all") return true;
                if (filter === "group") return diary.type === "SHARED";
                if (filter === "private") return diary.type === "PERSONAL"; // 또는 상응하는 타입값
                return true;
              })
              .map((diary) => (
                <div
                  key={diary.id}
                  onClick={() => navigate(`/diaries/${diary.id}`)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-2xl transition-colors ${
                        diary.type === "SHARED"
                          ? "bg-sky-50 text-sky-600 group-hover:bg-sky-100"
                          : "bg-sky-50 text-sky-600 group-hover:bg-sky-100"
                      }`}
                    >
                      {diary.type === "SHARED" ? (
                        <UsersIcon className="w-6 h-6" />
                      ) : (
                        <Book className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                    {diary.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {diary.type === "SHARED"
                      ? `${diary.membersCount}명 참여 중`
                      : "나만 보기"}
                  </p>
                </div>
              ))}
          </div>
          {/* 다이어리가 없을 경우 */}
          {!loading && diaryGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-6 mt-10 bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px] animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Book className="w-12 h-12 text-slate-300" />
                <Plus className="w-6 h-6 text-sky-400 absolute translate-x-6 -translate-y-6 bg-white rounded-full p-1 shadow-sm" />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  다이어리 공간이 비어있어요
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  오늘의 감정이나 소중한 사람들과의 기록을
                  <br />첫 번째 다이어리에 담아보세요.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                지금 시작하기
              </button>
            </div>
          )}
        </main>
        <CreateDiaryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchDiaries}
        />
      </div>
    </div>
  );
};

export default MainPage;
