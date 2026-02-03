import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useErrorHandler } from "../hooks/useErrorHandler";
import api from "../api/axiosInstance";
import { useSnackbar } from "../context/SnackbarContext";

const MyPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { errorHandler } = useErrorHandler();
  const { userEmail, logout } = useAuthStore();

  const storeNickname = useAuthStore((state) => state.nickname);
  const setNickname = useAuthStore((state) => state.setNickname);

  const [newNickname, setNewNickname] = useState(storeNickname ?? " "); // 입력창을 위한 상태 (zustand걸 가져오면 타이핑이 안됨. 그래서 useState로 타이핑 가능하도록 함)

  const handleSubmit = async () => {
    try {
      await api.patch("users/me", { nickname: newNickname });
      setNickname(newNickname);
      showSnackbar("닉네임 수정에 성공했습니다.", "success");
    } catch (error) {
      errorHandler(error, "닉네임 수정 중 문제가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col">
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              마이 페이지
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
            title="로그아웃"
          >
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 p-6 bg-slate-50/30">
          <div className="max-w-xl mx-auto space-y-6">
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-50 transition-transform group-hover:scale-105 bg-slate-100 flex items-center justify-center">
                  <User size={48} className="text-slate-300" />
                  {/* <img src={profileImg} alt="Profile" className="w-full h-full object-cover" /> */}
                </div>
                <div className="absolute bottom-0 right-0 p-2.5 bg-sky-500 text-white rounded-full shadow-lg group-hover:bg-sky-600 transition-colors border-4 border-white">
                  <Camera size={18} />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-400">
                프로필 사진 변경
              </p>
            </section>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-50">
                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">
                  닉네임
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 font-medium"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 active:scale-95 transition-all text-sm font-bold shadow-sm flex items-center gap-2"
                  >
                    변경
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-50 rounded-lg text-sky-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        이메일 계정
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
