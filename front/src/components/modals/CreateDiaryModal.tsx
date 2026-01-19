import React, { useState } from "react";
import { X, User, Users, BookPlus } from "lucide-react";
import api from "../../api/axiosInstance";
import { useSnackbar } from "../../context/SnackbarContext";
import { CreateDiaryRequest } from "../../types/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // 생성 후 목록 새로고침을 위한 콜백
}

const CreateDiaryModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const { showSnackbar } = useSnackbar();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return showSnackbar("제목을 입력해주세요.", "warning");

    setLoading(true);

    const requestData: CreateDiaryRequest = {
      title: title.trim(),
      description: "",
      type: isGroup ? "SHARED" : "PERSONAL",
    };
    try {
      await api.post("/groups", requestData);
      showSnackbar("다이어리가 생성되었습니다!", "success");
      onSuccess(); // 목록 새로고침 함수 실행
      onClose();
      setTitle(""); // 입력창 초기화
      setDescription("");
    } catch (error) {
      showSnackbar("생성 실패. 다시 시도해주세요.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 레이어 (클릭 시 닫힘) */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BookPlus className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-800">새 다이어리</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 타입 선택 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsGroup(false)}
                className={`flex-1 p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  !isGroup
                    ? "border-sky-500 bg-sky-50 text-sky-600"
                    : "border-slate-100 text-slate-400"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-bold">개인용</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGroup(true)}
                className={`flex-1 p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  isGroup
                    ? "border-sky-500 bg-sky-50 text-sky-600"
                    : "border-slate-100 text-slate-400"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm font-bold">그룹용</span>
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="다이어리 이름"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
              />
              <textarea
                placeholder="공지사항 (선택 사항)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
                isGroup
                  ? "bg-sky-600 hover:bg-sky-700"
                  : "bg-sky-600 hover:bg-sky-700"
              } disabled:opacity-50`}
            >
              {loading ? "생성 중..." : "다이어리 만들기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiaryModal;
