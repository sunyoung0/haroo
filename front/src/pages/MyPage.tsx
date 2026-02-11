import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef } from "react";
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  LogOut,
  X,
  Trash2,
  Image,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { deleteStorageFile, uploadImage } from "../services/imageService";
import api from "../api/axiosInstance";
import { useSnackbar } from "../context/SnackbarContext";
import { useEffect } from "react";

const MyPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { errorHandler } = useErrorHandler();
  const { userEmail, profileImage, setProfileImage, logout } = useAuthStore();

  const storeNickname = useAuthStore((state) => state.nickname);
  const setNickname = useAuthStore((state) => state.setNickname);

  const [newNickname, setNewNickname] = useState(storeNickname ?? " "); // 입력창을 위한 상태 (zustand걸 가져오면 타이핑이 안됨. 그래서 useState로 타이핑 가능하도록 함)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayImage = previewUrl || profileImage;

  // 숨겨진 input 태그 조작
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메뉴 밖 클릭 시 닫기
  const menuRef = useRef<HTMLDivElement>(null);

  // 드롭다운 토글
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 이미지 클릭 시 input 창 열기
  const handleEditClick = () => {
    setIsMenuOpen(false);
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
      // 기존 이미지가 있다면 스토리지에서 삭제
      if (profileImage) {
        await deleteStorageFile(profileImage);
      }

      // 새로운 이미지 업로드
      const downloadURL = await uploadImage(
        selectedFile,
        "profiles",
        userEmail,
      );

      const response = await api.patch("/users/profileImage", {
        profileImage: downloadURL,
      });

      setProfileImage(response.data);
      setSelectedFile(null);
      showSnackbar("프로필 이미지 변경 완료", "success");
    } catch (error) {
      console.error("에러 원인", error);
      errorHandler(error, "firebase 등록 중 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 프로필 이미지 삭제 클릭
  const handleDeletePhoto = async () => {
    try {
      // 스토리지 파일 삭제
      if (profileImage) {
        await deleteStorageFile(profileImage);
      }

      await api.patch("/users/profileImage", {
        profileImage: null,
      });

      setProfileImage(null);
      setPreviewUrl(null);
    } catch (error) {
      errorHandler(error, "프로필 이미지 삭제 중 문제가 발생했습니다.");
    }
    setIsMenuOpen(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadMyProfile = async () => {
      const response = await api.get("/users/me");
      setProfileImage(response.data.profileImage);
    };

    // 만약 이미 Zustand에 사진 정보가 있다면(방금 바꿨다면) 서버에서 가져올 필요가 없으므로
    if (userEmail && !profileImage) {
      loadMyProfile();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileImage]);

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
              <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">
                프로필 이미지
              </label>
              {/* 이미지 표시 영역 */}
              <div className="relative" ref={menuRef}>
                <div
                  className="relative group cursor-pointer"
                  onClick={toggleMenu}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-50 transition-transform group-hover:scale-105 bg-slate-100 flex items-center justify-center">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-slate-300" />
                    )}
                  </div>

                  {/* 카메라 아이콘 버튼 */}
                  <div className="absolute bottom-0 right-0 p-2.5 bg-sky-500 text-white rounded-full shadow-lg group-hover:bg-sky-600 transition-colors border-4 border-white">
                    <Camera size={18} />
                  </div>
                </div>

                {/* 드롭다운 메뉴 UI */}
                {isMenuOpen && (
                  <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Image size={16} className="text-sky-500" />
                      사진 선택
                    </button>

                    {/* 등록된 사진이 있을 때만 삭제 버튼 노출 */}
                    {(profileImage || previewUrl) && (
                      <button
                        onClick={handleDeletePhoto}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        사진 삭제
                      </button>
                    )}

                    <div className="h-px bg-slate-100 my-1"></div>

                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                      <X size={16} />
                      취소
                    </button>
                  </div>
                )}
              </div>

              {/* 변경사항 저장 버튼 */}
              {selectedFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="mt-8 px-8 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 shadow-md shadow-sky-100 disabled:bg-slate-300 transition-all active:scale-95"
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
