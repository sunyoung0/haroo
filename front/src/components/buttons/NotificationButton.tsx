import { useNotifications } from '../../context/NotificationContext';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export const NotificationButton = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2">
        <Bell size={24} className={unreadCount > 0 ? "text-sky-500" : "text-gray-500"} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-xl z-50">
          <div className="p-3 font-bold border-b">알림</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                }}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.isRead ? "bg-sky-50" : ""}`}
              >
                <p className="text-sm">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};