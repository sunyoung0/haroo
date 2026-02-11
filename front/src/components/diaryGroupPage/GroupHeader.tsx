import { ChevronLeft, Settings, Trash2, LogOut, Pen, User } from "lucide-react"; // 아이콘 추가
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationButton } from "../buttons/NotificationButton";
import { useAuthStore } from "../../store/useAuthStore";

interface GroupHeaderProps {
  title: string;
  onEditNotice: () => void;
  onDeleteOrLeave: () => void; // 삭제/탈퇴 함수 추가
  isOwner: boolean; // 방장 여부 추가
}

const GroupHeader = ({
  title,
  onEditNotice,
  onDeleteOrLeave,
  isOwner,
}: GroupHeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userId } = useAuthStore();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
      {/* 왼쪽: 뒤로가기 */}
      <button
        onClick={() => navigate("/")}
        className="p-1 text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 중앙: 제목 */}
      <h1 className="text-lg font-bold text-gray-800 flex-1 px-4">
        {title}
      </h1>

      {/* 오른쪽: 알람 + 설정 버튼 그룹 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/mypage/${userId}`)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all active:scale-95"
        >
          <User size={22} />
        </button>
        {/* 알람 버튼 */}
        <NotificationButton />

        {/* 설정 버튼 */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-full transition-colors ${
              isMenuOpen
                ? "bg-slate-100 text-sky-600"
                : "text-gray-600 hover:bg-slate-100"
            }`}
          >
            <Settings size={22} />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEditNotice();
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pen size={16} />
                  공지사항 설정
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteOrLeave();
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  {isOwner ? (
                    <>
                      <Trash2 size={16} />
                      다이어리 삭제
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      그룹 탈퇴
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default GroupHeader;
