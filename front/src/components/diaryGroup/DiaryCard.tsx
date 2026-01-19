import { MoreVertical, Heart, MessageCircle } from "lucide-react";
import { diaryGroupList } from "../../types/types";

interface DiaryCardProps {
  diary: diaryGroupList;
}

const DiaryCard = ({ diary }: DiaryCardProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
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

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Heart size={18} />
              <span className="text-sm font-semibold">{diary.likeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} />
              <span className="text-sm font-semibold">{diary.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;