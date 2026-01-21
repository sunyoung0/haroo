import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  Heart,
  Pen,
  Trash,
} from "lucide-react";
import { useSnackbar } from "../context/SnackbarContext";
import api from "../api/axiosInstance";
import axios from "axios";
import { GetDiaryDetail } from "../types/types";
import CommentSection from "../components/diaryDetailPage/CommentSection";

const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { diaryId } = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지를 위한 ref

  const [diariesDetail, setDiariesDetail] = useState<GetDiaryDetail | null>(
    null,
  );

  const getDiaryDetail = async () => {
    try {
      const response = await api.get(`/diaries/detail/${diaryId}`);
      setDiariesDetail(response.data);
    } catch (error) {
      console.log("에러 발생 : ", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "다이어리를 불러오는 중 오류가 발생했습니다.";
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

  // 삭제 함수
  const handleDelete = async () => {
    if (!window.confirm("일기를 정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/diaries/${diaryId}`);
      showSnackbar("일기가 삭제되었습니다.", "success");
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.log("에러 발생 : ", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "다이어리를 불러오는 중 오류가 발생했습니다.";
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

  // 수정 페이지 이동
  const handleEdit = () => {
    navigate(`/diaries/edit/${diaryId}`);
  };

  // 좋아요 버튼 클릭
  const handleLikeClick = async () => {
    if (!diariesDetail) return;

    try {
      await api.post(`/diaries/like/${diaryId}`);
      setDiariesDetail({
        ...diariesDetail,
        isLike: !diariesDetail.isLike,
        likeCount: diariesDetail.isLike
          ? diariesDetail.likeCount - 1
          : diariesDetail.likeCount + 1,
      });
    } catch (error) {
      console.log("에러 발생 : ", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message || "좋아요 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  // 메뉴 외 영역 클릭 시 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (diaryId) {
      getDiaryDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId]);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col relative min-h-screen">
        <header className="bg-white px-4 py-4 flex items-center sticky top-0 z-30">
          <div className="flex-none">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">
              {diariesDetail?.writerNickname}님의 일기
            </h1>
          </div>

          <div className="flex-1 flex justify-end relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full transition-colors ${isMenuOpen ? "bg-slate-100" : "hover:bg-slate-100"}`}
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                >
                  <Pen size={18} className="text-slate-400" />
                  <span>일기 수정</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <Trash size={18} className="text-red-400" />
                  <span>일기 삭제</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-32">
          {/* 제목 섹션 */}
          <div className="border-t border-b border-sky-100 px-6 py-8 text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4">
              {diariesDetail?.title}
            </h2>

            {/* 날짜 및 기분 */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-xs">
                <Calendar size={13} className="text-slate-300" />
                <span>{diariesDetail?.date}</span>
              </div>

              <div className="h-2 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
                <span className="text-lg">{diariesDetail?.feelingType}</span>
              </div>
            </div>
          </div>

          {/* 일기 본문 내용 */}
          <article className="p-8">
            <div className="text-slate-700 text-[17px] leading-[1.9] whitespace-pre-wrap font-medium min-h-[300px]">
              {diariesDetail?.content}
            </div>

            {/* 좋아요 버튼 */}
            <div className="mt-16 flex justify-center">
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-100 bg-white shadow-sm hover:bg-pink-50 hover:border-pink-100 transition-all group active:scale-95"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    diariesDetail?.isLike
                      ? "fill-current text-pink-500"
                      : "text-slate-300 group-hover:text-pink-400"
                  }`}
                />
                <span
                  className={`font-bold ${diariesDetail?.isLike ? "text-pink-500" : "text-slate-600 group-hover:text-pink-500"}`}
                >
                  좋아요 {diariesDetail?.likeCount}
                </span>
              </button>
            </div>
          </article>
          <CommentSection
            diaryId={diaryId}
            commentCount={diariesDetail?.commentCount ?? 0}
            onCommentChange={getDiaryDetail} // 댓글 변동 시 일기 정보 다시 불러오기
          />
        </main>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
