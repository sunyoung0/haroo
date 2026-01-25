import { MoreVertical, Heart, MessageCircle } from "lucide-react";
import { diaryGroupList } from "../../types/types";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface DiaryCardProps {
  diary: diaryGroupList;
}

const DiaryCard = ({ diary }: DiaryCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem("diary_list_scroll");

    if (savedScrollPos) {
      // 대량을 불러오는 중이라면 약간의 시간 필요
      window.scrollTo(0, parseInt(savedScrollPos));
      // 한번 복구 후 지우기
      sessionStorage.removeItem("diary_list_scroll");
    }
  }, [location]);

  //  상세 페이지로 이동할 때 현재 위치 저장
  const handleOnClick = (id: number) => {
    sessionStorage.setItem('diary_list_scroll', window.scrollY.toString());
    navigate(`/diaries/detail/${id}`);
  };

  return (
    <div
      onClick={() => handleOnClick(diary.id)}
      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md cursor-pointer active:scale-[0.98]"
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
          <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-bold">
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

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Heart size={18} />
              <span className="text-sm font-semibold">{diary.likeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} />
              <span className="text-sm font-semibold">
                {diary.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;
