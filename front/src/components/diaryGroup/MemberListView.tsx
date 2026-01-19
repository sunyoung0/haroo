import { Crown, MoreVertical, User } from "lucide-react";
import { MemberList } from "../../types/types";

interface MemberListViewProps {
  members: MemberList[];
  isOwner: boolean;
  currentUserEmail?: string | null;
  onInvite: () => void;
}

const MemberListView = ({ members, isOwner, currentUserEmail, onInvite }: MemberListViewProps) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* 요약 헤더 섹션 */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider">
            Total Members
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-purple-600">
              {members.length}
            </span>
            <span className="text-sm font-bold text-slate-500">명</span>
          </div>
        </div>
        <button
          onClick={onInvite}
          className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 active:scale-95"
        >
          + 멤버 초대
        </button>
      </div>

      {/* 멤버 리스트 카드 */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3">
          {members.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-slate-400 text-sm font-medium">
                참여 중인 멤버가 없습니다.
              </p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-all rounded-[2rem] group"
              >
                {/* 유저 정보 */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                      member.role === "OWNER"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <User />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800 text-base">
                      {member.nickname}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      참여일 : {member.joinedAt}
                    </span>
                  </div>
                </div>

                {/* 역할 표시, 메뉴 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-[10px] tracking-tight ${
                      member.role === "OWNER"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}
                  >
                    {member.role === "OWNER" ? (
                      <>
                        <Crown size={12} />
                        <span>방장</span>
                      </>
                    ) : (
                      <>
                        <User size={12} />
                        <span>멤버</span>
                      </>
                    )}
                  </div>

                  {/* 내가 방장일 때만 나를 제외한 멤버에만 버튼 노출 */}
                {isOwner && member.userEmail !== currentUserEmail ? (
                  <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                    <MoreVertical size={18} />
                  </button>
                ) : (
                  <div className="w-9" />
                )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberListView;
