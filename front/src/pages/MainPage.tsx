import { Plus, LogOut, User, Calendar, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CreateDiaryModal from "../components/modals/CreateDiaryModal";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { UsersIcon, Book } from "lucide-react";
import { useSnackbar } from "../context/SnackbarContext";
import axios from "axios";
import { DiaryGroup } from "../types/types";

const MainPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
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

  const handleDelete = async (diary: DiaryGroup) => {
    let confirmMsg = "";

    if (diary.type === "PERSONAL") {
      confirmMsg = "다이어리를 삭제하시겠습니까?";
    } else {
      confirmMsg =
        diary.role === "OWNER"
          ? "다이어리를 삭제하시겠습니까? (방장 권한: 모든 데이터가 삭제됩니다)"
          : "이 다이어리 그룹에서 탈퇴하시겠습니까?";
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      if (diary.role === "OWNER") {
        await api.delete(`/groups/${diary.id}`);
        showSnackbar("다이어리 그룹이 삭제되었습니다.", "warning");
      } else {
        await api.delete(`/groups/leave/${diary.id}`);
        showSnackbar("다이어리 그룹을 탈퇴하였습니다.", "warning");
      }

      // 성공 후 목록 새로고침
      fetchDiaries();
    } catch (error) {
      console.error("작업 실패: ", error);

      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message || "오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar(serverMessage, "warning");
        }
      }
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
                        ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100"
                        : "bg-sky-50 text-sky-600 group-hover:bg-sky-100"
                    }`}
                  >
                    {diary.type === "SHARED" ? (
                      <UsersIcon className="w-6 h-6" />
                    ) : (
                      <Book className="w-6 h-6" />
                    )}
                  </div>

                  {/* 삭제 버튼 */}
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                        handleDelete(diary);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={
                        diary.role === "OWNER" ? "다이어리 삭제" : "그룹 탈퇴"
                      }
                    >
                      {diary.role === "OWNER" ? (
                        <Trash2 className="w-4 h-4" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </button>
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
  );
};

export default MainPage;
