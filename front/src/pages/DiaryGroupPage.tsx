import {
  ArrowLeft,
  Settings,
  MoreVertical,
  Pin,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useState, useEffect } from "react";

type diaryGroupList = {
  id: number;
  notice: string;
  title: string;
  nickname: string;
  feelingType: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
};

const DiaryGroupPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [diariesList, setDiariesList] = useState<diaryGroupList[]>([]);
  const [groupInfo, setGroupInfo] = useState({ title: "", notice: "" });

  const getDiaries = async () => {
    try {
      const response = await api.get(`/diaries/${groupId}`);
      setDiariesList(response.data.diaries);
      setGroupInfo({
        title: response.data.groupTitle,
        notice: response.data.groupNotice,
      });
    } catch (error) {
      console.log("에러 발생 : ", error);
    }
  };

  useEffect(() => {
    getDiaries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate("/")}
            className="p-1 text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">{groupInfo.title}</h1>
          <button className="p-1 text-gray-600 hover:bg-slate-100 rounded-full transition-colors">
            <Settings size={24} />
          </button>
        </header>

        {/* 서브 헤더 (공지사항/설명 영역) */}
        <div className="p-4 bg-white">
          <div className="w-full py-3 px-4 rounded-2xl border border-purple-100 bg-purple-50/50 flex items-center justify-center gap-2 text-purple-600 font-semibold shadow-sm">
            <Pin size={18} className="shrink-0" />
            <span className="truncate">
              {groupInfo.notice || "공지사항이 없습니다."}
            </span>
          </div>
        </div>

        {/* 상세 콘텐츠 영역 */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
          {diariesList.length > 0 ? (
            diariesList.map((diary) => (
              <div
                key={diary.id}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {diary.title}
                    </h2>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                      # {diary.feelingType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-700">
                        {diary.nickname}
                      </span>
                      <span className="text-sm font-medium text-slate-400">
                        {diary.createdAt?.substring(0, 10)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Heart size={18} />
                        <span className="text-sm font-semibold">
                          {diary.likeCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MessageCircle size={18} />
                        <span className="text-sm font-semibold">
                          {diary.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 font-medium">
              아직 작성된 일기가 없습니다.
            </div>
          )}
          <div className="h-10" />
        </main>
      </div>
    </div>
  );
};

export default DiaryGroupPage;
