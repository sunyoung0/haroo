import { ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GroupHeaderProps {
  title: string;
  onEditNotice: () => void;
  onInvite: () => void;
}

const GroupHeader = ({ title, onEditNotice, onInvite }: GroupHeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
      <button
        onClick={() => navigate("/")}
        className="p-1 text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-lg font-bold text-gray-800">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-1 rounded-full transition-colors ${
            isMenuOpen
              ? "bg-slate-100 text-purple-600"
              : "text-gray-600 hover:bg-slate-100"
          }`}
        >
          <Settings size={24} />
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
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                공지사항 설정
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onInvite();
                }}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                멤버 초대
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default GroupHeader;
