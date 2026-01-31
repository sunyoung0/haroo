import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import api from "../api/axiosInstance";
import { useSnackbar } from "../context/SnackbarContext";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { FEELING_TYPES } from "../constants/feeling";
import { debounce } from "lodash";

const DiaryWritePage = () => {
  const { groupId, diaryId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { errorHandler } = useErrorHandler();
  const isEditMode = Boolean(diaryId); // 수정 인지 확인

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [diaryDate, setDiaryDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [feelingType, setFeelingType] = useState("HAPPY");
  const [tempDiaryId, setTempDiaryId] = useState<number | null>(null);

  // 임시 저장 함수
  const handleTempSave = async (data: any) => {
    try {
      const response = await api.post("/diaries/temp", {
        ...data,
        diaryId: tempDiaryId, // ID가 있으면 수정, 없으면 신규 생성
        groupId: Number(groupId),
      });

      if (!tempDiaryId && response.data) {
        setTempDiaryId(response.data);
      }
      console.log("임시저장 완료");
    } catch (error) {
      errorHandler(error, "임시 저장 중 오류가 발생했습니다.");
    }
  };

  // lodash의 debounce로 감싸기, useCallback을 써야 리렌더링 시 함수가 새로 만들어지지 않음
  const delayedSave = useCallback(
    debounce((data) => handleTempSave(data), 3000), // 3초 뒤 실행
    [tempDiaryId], // ID가 바뀌면 함수 갱신
  );

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

      if (isEditMode) {
        // 수정 요청 (PUT)
        await api.put(`/diaries/${diaryId}`, diaryDto);
        showSnackbar("일기가 수정되었습니다!", "success");
      } else {
        // 새 작성 요청 (POST)
        await api.post(`/diaries/${groupId}`, diaryDto);
        showSnackbar("오늘의 기록이 저장되었습니다!", "success");
      }
      navigate(-1);
    } catch (error) {
      errorHandler(error, "일기 작성 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    // 아무 내용이 없으면 저장하지 않음
    if (!title && !content) return;

    delayedSave({ title, content, feelingType });

    // 컴포넌트가 사라질 때 대기중인 예약 취소
    return () => delayedSave.cancel();
  }, [title, content, feelingType, delayedSave]);

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      const fetchDiaryDetail = async () => {
        try {
          const response = await api.get(`/diaries/detail/${diaryId}`);
          const { title, content, createdAt, feelingType } = response.data;
          setTitle(title);
          setContent(content);
          setDiaryDate(createdAt.slice(0, 10).replace(/\./g, "-"));
          setFeelingType(feelingType);
        } catch (error) {
          showSnackbar("데이터를 불러오지 못했습니다.", "error");
        }
      };
      fetchDiaryDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId, isEditMode]);

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
            <h1 className="text-lg font-bold text-slate-800">
              {isEditMode ? "일기 수정" : "일기 작성"}
            </h1>
          </div>
          <div>
            <button
              onClick={handleTempSave}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-sky-100"
            >
              임시저장
            </button>
            <button
              onClick={handleSave}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-sky-100"
            >
              {isEditMode ? "수정 완료" : "저장"}
            </button>
          </div>
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
