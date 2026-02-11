import { useState } from "react";
import { Bell, MessageCircle, Heart, UserPlus, X } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../types/types";

export const NotificationButton = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification, deleteAllNotifications } =
    useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 알림 방금전/몇분전 시간 설정 하는 함수
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return;

    // 문자열을 Date 객체로 변환
    const now = new Date();
    const past = new Date(dateString.replace(" ", "T")); // 공백을 T로 바꿔야 정확히 인식됨
    const diffInMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    // 7일 이상 지나면 그냥 날짜 표시 (10글자)
    return dateString.slice(0, 10);
  };

  // 알림 타입별 아이콘 및 스타일 설정
  const getNotificationType = (type: string) => {
    switch (type) {
      case "COMMENT":
        return {
          icon: <MessageCircle size={14} />,
          color: "text-blue-500",
          bg: "bg-blue-50",
        };
      case "LIKE":
        return {
          icon: <Heart size={14} />,
          color: "text-pink-500",
          bg: "bg-pink-50",
        };
      case "GROUP_INVITE":
        return {
          icon: <UserPlus size={14} />,
          color: "text-green-500",
          bg: "bg-green-50",
        };
      default:
        return {
          icon: <Bell size={14} />,
          color: "text-gray-500",
          bg: "bg-gray-50",
        };
    }
  };

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id); // 읽음처리 먼저 실행
    // URL 에서 ID 추출 -> 현재 /diaries/comment/3 이런 형식이라 끝에 id 번호만 추출
    const parts = n.url.split("/");
    const targetId = parts[parts.length - 1];

    // 타입별 실제 페이지 경로 매핑
    switch (n.type) {
      case "COMMENT":
      case "LIKE":
        // 다이어리 상세 페이지로 이동
        navigate(`/diaries/detail/${targetId}`);
        break;
      case "GROUP_INVITE":
        navigate(`/diaries/${targetId}`);
        break;
      default:
        console.warn("알 수 없는 알림 타입: ", n.type);
    }

    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* 종 아이콘 버튼 */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
      >
        <Bell
          size={22}
          className={unreadCount > 0 ? "text-sky-500" : "text-gray-500"}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-4 font-bold text-gray-800 border-b flex justify-between items-center bg-white">
              <span>알림</span>
              {notifications.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("모든 알림을 삭제하시겠습니까?")) {
                      deleteAllNotifications();
                    }
                  }}
                  className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  전체 삭제
                </button>
              )}
              {unreadCount > 0 && (
                <span className="text-xs font-normal text-sky-500">
                  새로운 알림 {unreadCount}개
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">
                  새로운 알림이 없습니다.
                </div>
              ) : (
                notifications.map((n) => {
                  const style = getNotificationType(n.type);
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        handleNotificationClick(n);
                      }}
                      className={`group relative flex items-start gap-3 p-4 border-b last:border-0 cursor-pointer transition-colors ${
                        !n.isRead
                          ? "bg-sky-50/40 hover:bg-sky-50"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      {/* 타입별 아이콘 */}
                      <div
                        className={`mt-0.5 p-2 rounded-lg ${style.bg} ${style.color}`}
                      >
                        {style.icon}
                      </div>

                      <div className="flex-1 pr-6">
                        <p
                          className={`text-sm leading-relaxed ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}
                        >
                          {n.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatTimeAgo(n.createdAt)}
                        </p>
                        {/* 3. 삭제(X) 버튼 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 클릭 시 페이지 이동(부모 onClick) 방지
                            deleteNotification(n.id);
                          }}
                          className="absolute top-4 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="알림 삭제"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {!n.isRead && (
                        <div className="absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
