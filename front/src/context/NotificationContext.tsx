import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Notification } from "../types/types";
import api from "../api/axiosInstance";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useAuthStore } from "../store/useAuthStore";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail: string | null;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!userEmail || !token) return;

    // 토큰이 없으면 아직 로그인 처리 중인 것이므로 구독하지 않음
    if (!token) {
      console.log("알림 구독 대기: 토큰이 아직 로컬 스토리지에 없습니다.");
      return;
    }

    const notificationList = async () => {
      const response = await api.get("/notifications");
      setNotifications(response.data);
      console.log(response.data);
    };
    notificationList();

    // 2. SSE 구독
    const EventSource = EventSourcePolyfill || NativeEventSource;

    const eventSource = new EventSource(`http://localhost:8080/subscribe`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      heartbeatTimeout: 60 * 60 * 1000, // 1시간 (연결 유지 시간)
    });

    eventSource.onopen = () => console.log("SSE 연결 성공!");
    eventSource.onerror = (err) => {
      console.error("SSE 연결 실패:", err);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [userEmail, token]);

  // 읽음 처리 함수
  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return context;
};
