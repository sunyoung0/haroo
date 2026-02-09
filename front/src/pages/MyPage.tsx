import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef } from "react";
import { ChevronLeft, Camera, User, Mail, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { uploadImage } from "../services/imageService";
import api from "../api/axiosInstance";
import { useSnackbar } from "../context/SnackbarContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const MyPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { errorHandler } = useErrorHandler();
  const { userEmail, logout } = useAuthStore();

  const storeNickname = useAuthStore((state) => state.nickname);
  const setNickname = useAuthStore((state) => state.setNickname);

  const [newNickname, setNewNickname] = useState(storeNickname ?? " "); // 입력창을 위한 상태 (zustand걸 가져오면 타이핑이 안됨. 그래서 useState로 타이핑 가능하도록 함)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 숨겨진 input 태그 조작
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 클릭 시 input 창 열기
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 선택 시 실행(미리보기만 처리)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 브라우저 메모리에 임시 URL 생성 (미리보기용)
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 등록 버튼 클릭 시 실제 firebase 업로드
  const handleImageUpload = async () => {
    if (!selectedFile || !userEmail) {
      alert("이미지를 선택해주세요.");
      return;
    }
    setIsUploading(true);

    try {
      const downloadURL = await uploadImage(
        selectedFile,
        "profiles",
        userEmail,
      );
      console.log("업로드 성공 ", downloadURL);
      console.log("DB에 사용할 이메일:", userEmail);

      const userRef = doc(db, "users", userEmail.trim());
      console.log("주소(참조) 생성 완료");

  setDoc(userRef, {
    profileImage: downloadURL,
  },)

  console.log("4. serDoc 호출 직후");

      alert("DB 등록 성공");
    } catch (error) {
      console.error("에러 원인", error);
      errorHandler(error, "firebase 등록 중 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNicknameUpload = async () => {
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
              {/* 실제 파일 선택 창 (숨김) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              {/* 이미지 표시 영역 */}
              <div
                className="relative group cursor-pointer"
                onClick={handleEditClick}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-50 transition-transform group-hover:scale-105 bg-slate-100 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>

                {/* 카메라 아이콘 */}
                <div className="absolute bottom-0 right-0 p-2.5 bg-sky-500 text-white rounded-full shadow-lg group-hover:bg-sky-600 transition-colors border-4 border-white">
                  <Camera size={18} />
                </div>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-400">
                프로필 사진 변경
              </p>

              {/* 등록 버튼 (이미지가 선택되었을 때만 등장) */}
              {selectedFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-300 transition-colors"
                >
                  {isUploading ? "저장 중..." : "변경사항 저장"}
                </button>
              )}
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
                    onClick={handleNicknameUpload}
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
