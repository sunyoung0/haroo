import React, { useState, useEffect, useRef } from "react";
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
  const [replyTo, setReplyTo] = useState<{
    id: number;
    nickname: string;
  } | null>(null);
  const [expandedComments, setExpandedComments] = useState<number[]>([]); // 답글창 목록 관리
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showSnackbar } = useSnackbar();

  // 답글 취소 함수
  const cancelReply = () => setReplyTo(null);

  const toggleReplies = (commentId: number) => {
    setExpandedComments(
      (prev) =>
        prev.includes(commentId)
          ? prev.filter((id) => id !== commentId) // 열려있으면 닫기
          : [...prev, commentId], // 닫혀있으면 열기
    );
  };

  // 스크롤 이동 함수
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100); // 목록이 렌더링될 시간을 조금 줌
  };

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
      const parentIdForExpanding = replyTo ? replyTo.id : null; // 현재 부모 ID 백업

      await api.post(`/diaries/comment/${diaryId}`, {
        content: newComment,
        parentId: parentIdForExpanding,
      });

      // 답글 작성 시 답글 펼침
      if (parentIdForExpanding) {
        setExpandedComments((prev) =>
          prev.includes(parentIdForExpanding)
            ? prev
            : [...prev, parentIdForExpanding],
        );
      }

      setNewComment("");
      setReplyTo(null); // 답글 모드 해제
      fetchComments(); // 목록 새로고침
      onCommentChange(); // 상위 카운트 업데이트
      scrollToBottom();
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
      <section className="px-6 pb-40">
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">댓글 {commentCount}</h3>
        </div>

        <div className="space-y-8">
          {comments
            .filter((c) => !c.parentId) // 부모 댓글만 먼저 순회
            .map((comment) => {
              const childReplies = comments.filter(
                (reply) => reply.parentId === comment.id,
              );
              const isExpanded = expandedComments.includes(comment.id);

              return (
                <div key={comment.id} className="flex flex-col">
                  {/* 댓글 영역 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0">
                      {comment.nickname?.[0] || "?"}
                    </div>

                    <div
                      className={`flex-1 min-w-0 ${childReplies.length > 0 && isExpanded ? "" : "border-b border-slate-50"} pb-6`}
                    >
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

                      <div className="mt-3 flex items-center gap-4">
                        <button
                          onClick={() =>
                            setReplyTo({
                              id: comment.id,
                              nickname: comment.nickname,
                            })
                          }
                          className="text-[11px] font-bold text-sky-500/70 hover:text-sky-600"
                        >
                          답글 쓰기
                        </button>

                        {comment.isMine && !editingId && (
                          <>
                            <button
                              onClick={() =>
                                startEdit(comment.id, comment.content)
                              }
                              className="text-[11px] font-bold text-slate-400 hover:text-sky-500"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-[11px] font-bold text-slate-400 hover:text-red-400"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>

                      {/* 답글 토글 버튼 */}
                      {childReplies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="mt-4 text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          {isExpanded
                            ? "▲ 답글 숨기기"
                            : `▼ 답글 ${childReplies.length}개 보기`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 답글 리스트 영역 */}
                  {isExpanded && (
                    <div className="mt-2 ml-10 space-y-4 border-l-2 border-slate-50 pl-4 pb-4">
                      {childReplies.map((reply) => (
                        <div
                          key={reply.id}
                          className="flex gap-3 group animate-in fade-in slide-in-from-top-1"
                        >
                          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            {reply.nickname?.[0] || "?"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[12px] text-slate-700">
                                {reply.nickname}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {reply.createdAt}
                              </span>
                            </div>

                            {editingId === reply.id ? (
                              <div className="mt-2">
                                <textarea
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
                                  className="w-full bg-slate-50 p-2 rounded-lg text-[13px] text-slate-700 outline-none focus:ring-1 focus:ring-sky-200 resize-none"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2 mt-1">
                                  <button
                                    onClick={cancelEdit}
                                    className="px-2 py-1 text-[10px] font-bold text-slate-400"
                                  >
                                    취소
                                  </button>
                                  <button
                                    onClick={() => handleUpdate(reply.id)}
                                    className="px-2 py-1 text-[10px] font-bold bg-sky-600 text-white rounded-md shadow-sm"
                                  >
                                    수정 완료
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="text-[13px] text-slate-600 leading-relaxed break-words">
                                  {reply.content}
                                </div>

                                {/* 수정/삭제 버튼들 */}
                                <div className="mt-2 flex items-center gap-3">
                                  {reply.isMine && (
                                    <>
                                      <button
                                        onClick={() =>
                                          startEdit(reply.id, reply.content)
                                        }
                                        className="text-[10px] font-bold text-slate-400 hover:text-sky-500 transition-colors"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => handleDelete(reply.id)}
                                        className="text-[10px] font-bold text-slate-400 hover:text-red-400 transition-colors"
                                      >
                                        삭제
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          {comments.length === 0 && (
            <div className="py-10 text-center text-slate-300 text-sm">
              첫 번째 댓글을 남겨보세요!
            </div>
          )}
        </div>
        <div ref={scrollRef} className="h-2" />
      </section>

      {/* 하단 고정 입력바 */}
      <footer className="fixed bottom-0 max-w-2xl w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 z-40">
        {/* 답글 모드 안내 바 */}
        {replyTo && (
          <div className="flex justify-between items-center mb-2 px-3 py-1.5 bg-sky-50 rounded-xl border border-sky-100">
            <span className="text-[12px] text-sky-700 font-medium">
              <strong>@{replyTo.nickname}</strong> 님에게 답글 작성 중...
            </span>
            <button
              onClick={cancelReply}
              className="text-[11px] text-sky-400 hover:text-sky-600 font-bold"
            >
              취소
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-transparent focus-within:border-sky-300 focus-within:bg-white transition-all shadow-inner">
            <input
              type="text"
              placeholder={
                replyTo ? "답글을 입력하세요..." : "댓글을 입력해주세요 :)"
              }
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
              {replyTo ? "답글" : "전송"}
            </button>
          </div>
        </form>
      </footer>
    </>
  );
};

export default CommentSection;
