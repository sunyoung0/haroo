import { LayoutGrid, Calendar, Users } from "lucide-react";

interface GroupTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GroupTabs = ({ activeTab, setActiveTab }: GroupTabsProps) => {
  const tabs = [
    { id: "feed", label: "피드", icon: <LayoutGrid size={18} /> },
    { id: "calendar", label: "캘린더", icon: <Calendar size={18} /> },
    { id: "members", label: "멤버", icon: <Users size={18} /> },
  ];

  return (
    <div className="px-4 bg-white border-b border-slate-100 sticky top-[65px] z-20">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative py-4 px-2 flex items-center gap-2 group"
          >
            <span
              className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "text-purple-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </span>
            {/* 활성화 표시 바 (Underline) */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupTabs;