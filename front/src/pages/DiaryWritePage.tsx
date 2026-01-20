import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import api from "../api/axiosInstance";
import axios from "axios";
import { useSnackbar } from "../context/SnackbarContext";

// 기분 타입 및 이모지 설정 (FEELING_TYPES)
const FEELING_TYPES = [
  {
    id: "HAPPY",
    label: "기쁨",
    emoji: "😊",
    color: "bg-yellow-100 text-yellow-700",
  },
  { id: "SAD", label: "슬픔", emoji: "😢", color: "bg-blue-100 text-blue-700" },
  { id: "ANGRY", label: "화남", emoji: "😡", color: "bg-red-100 text-red-700" },
  {
    id: "ANXIOUS",
    label: "불안",
    emoji: "😰",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "CLAM",
    label: "평온",
    emoji: "🧘",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "TIRED",
    label: "피곤",
    emoji: "🥱",
    color: "bg-slate-200 text-slate-700",
  },
  {
    id: "EXCITED",
    label: "설렘",
    emoji: "✨",
    color: "bg-pink-100 text-pink-700",
  },
];

const DiaryWritePage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [diaryDate, setDiaryDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [feelingType, setFeelingType] = useState("HAPPY");


  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showSnackbar("제목과 내용을 모두 입력해주세요.", "warning");
      return;
    }

    try {
      const diaryDto = {
        title,
        content,
        diaryDate,
        feelingType,
      };

      await api.post(`/diaries/${groupId}`, diaryDto);
      showSnackbar("오늘의 기록이 저장되었습니다!", "success");
      navigate(-1);
    } catch (error) {
      console.error("저장 실패:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "다이어리를 작성하는 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 403) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-slate-100 px-4 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">일기 작성</h1>
          </div>

          <button
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-sky-100"
          >
            저장
          </button>
        </header>

        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              날짜 선택
            </label>
            <div className="flex items-center gap-2 bg-slate-50 w-fit px-4 py-2.5 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors">
              <CalendarIcon className="w-4 h-4 text-sky-500" />
              <input
                type="date"
                value={diaryDate}
                onChange={(e) => setDiaryDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              오늘의 기분
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {FEELING_TYPES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFeelingType(f.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                    feelingType === f.id
                      ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                      : "border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">{f.emoji}</span>
                  <span className="text-sm font-bold">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="오늘의 제목은 무엇인가요?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold text-slate-800 border-none outline-none placeholder:text-slate-200 mb-4"
          />

          <div className="h-px bg-slate-100 w-full mb-6" />

          <textarea
            placeholder="이곳에 당신의 소중한 기록을 담아보세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 text-slate-700 text-lg leading-relaxed border-none outline-none resize-none placeholder:text-slate-200 min-h-[400px]"
          />
        </main>
      </div>
    </div>
  );
};

export default DiaryWritePage;
