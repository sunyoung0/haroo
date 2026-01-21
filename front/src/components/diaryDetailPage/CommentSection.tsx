import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import api from "../../api/axiosInstance";
import axios from "axios";
import { useSnackbar } from "../../context/SnackbarContext";
import { GetCommentList } from "../../types/types";

interface CommentSectionProps {
  diaryId: string | undefined;
  commentCount: number;
  onCommentChange: () => void; // 댓글 작성/삭제 시 상위 컴포넌트의 카운트 갱신용
}

const CommentSection = ({
  diaryId,
  commentCount,
  onCommentChange,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<GetCommentList[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const { showSnackbar } = useSnackbar();

  // 수정 함수
  const startEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  // 수정 취소 함수
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 수정 완료 제출 함수
  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      await api.put(`/comment/${commentId}`, { content: editContent });
      showSnackbar("댓글이 수정되었습니다.", "success");
      setEditingId(null);
      fetchComments(); // 목록 새로고침
    } catch (error) {
      showSnackbar("수정 실패", "error");
    }
  };

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await api.get(`/diaries/comment/${diaryId}`);
      setComments(response.data || []);
    } catch (error) {
      console.error("댓글 로드 실패", error);
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

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/diaries/comment/${diaryId}`, { content: newComment });
      setNewComment("");
      fetchComments(); // 목록 새로고침
      onCommentChange(); // 상위 카운트 업데이트
      showSnackbar("댓글이 등록되었습니다.", "success");
    } catch (error) {
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

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/comment/${commentId}`);
      fetchComments();
      onCommentChange();
      showSnackbar("댓글이 삭제되었습니다.", "success");
    } catch (error) {
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

  useEffect(() => {
    if (diaryId) fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId]);

  return (
    <>
      <section className="px-6 pb-32">
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">댓글 {commentCount}</h3>
        </div>

        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0">
                {comment.nickname?.[0] || "?"}
              </div>

              <div className="flex-1 min-w-0 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[14px] text-slate-800">
                    {comment.nickname}
                  </span>
                  <span className="text-[12px] text-slate-400">
                    {comment.createdAt || "방금 전"}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-sm text-slate-700 outline-none focus:ring-1 focus:ring-sky-200 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-[11px] font-bold text-slate-400"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleUpdate(comment.id)}
                        className="px-3 py-1.5 text-[11px] font-bold bg-sky-600 text-white rounded-lg"
                      >
                        수정 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[14px] text-slate-600 leading-relaxed break-words pr-4">
                    {comment.content}
                  </div>
                )}

                {/* 하단 액션 버튼 */}
                {comment.isMine && !editingId && (
                  <div className="mt-3 flex gap-3 transition-opacity">
                    <button
                      onClick={() => startEdit(comment.id, comment.content)}
                      className="text-[11px] font-bold text-slate-400 hover:text-sky-500 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-[11px] font-bold text-slate-400 hover:text-red-400 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="py-10 text-center text-slate-300 text-sm">
              첫 번째 댓글을 남겨보세요! ✨
            </div>
          )}
        </div>
      </section>

      {/* 하단 고정 입력바 */}
      <footer className="fixed bottom-0 max-w-2xl w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 z-40">
  <form onSubmit={handleSubmit} className="flex items-center gap-3">
    <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-transparent focus-within:border-sky-300 focus-within:bg-white transition-all shadow-inner">
      <input
        type="text"
        placeholder="댓글을 입력해주세요 :)"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none py-1.5 text-sm text-slate-700 placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={!newComment.trim()}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          newComment.trim()
            ? "bg-sky-500 text-white shadow-md shadow-sky-100"
            : "bg-slate-300 text-white"
        }`}
      >
        전송
      </button>
    </div>
  </form>
</footer>
    </>
  );
};

export default CommentSection;
