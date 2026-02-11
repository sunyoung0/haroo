import { Crown, MoreVertical, User, UserMinus } from "lucide-react";
import { MemberList } from "../../types/types";
import { useState } from "react"; // useState 추가

interface MemberListViewProps {
  members: MemberList[];
  isOwner: boolean;
  currentUserEmail?: string | null;
  onInvite: () => void;
  onOut: (email: string) => void;
}

const MemberListView = ({
  members,
  isOwner,
  currentUserEmail,
  onInvite,
  onOut,
}: MemberListViewProps) => {
  // 어떤 유저의 메뉴가 열려있는지 관리하는 상태 (이메일 기준)
  const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* 요약 헤더 섹션 */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider">
            Total Members
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-sky-600">
              {members.length}
            </span>
            <span className="text-sm font-bold text-slate-500">명</span>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={onInvite}
            className="px-5 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-2xl hover:bg-sky-700 transition-all active:scale-95"
          >
            + 멤버 초대
          </button>
        )}
      </div>

      {/* 멤버 리스트 카드 */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 ">
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
                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-all rounded-[2rem] group relative"
              >
                {/* 유저 정보 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={`${member.nickname}의 프로필`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // 프로필 이미지가 없을 때 보여줄 기본 아이콘
                      <User size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {/* 닉네임과 뱃지를 가로로 묶어주는 컨테이너 */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-base">
                        {member.nickname}
                      </span>

                      {member.userEmail === currentUserEmail && (
                        <span className="w-fit h-fit border border-sky-500/30 text-sky-600 text-[9px] px-1.5 py-0.5 rounded-full font-black tracking-tighter bg-sky-50/50 leading-none flex items-center justify-center">
                          ME
                        </span>
                      )}
                    </div>

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

                  {/* 메뉴 버튼 영역 */}
                  {isOwner && member.userEmail !== currentUserEmail ? (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuEmail(
                            openMenuEmail === member.userEmail
                              ? null
                              : member.userEmail,
                          )
                        }
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* 메뉴 버튼 - 강퇴 */}
                      {openMenuEmail === member.userEmail && (
                        <>
                          {/* 바깥 클릭 시 닫기 위한 레이어 */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuEmail(null)}
                          />
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <button
                              onClick={() => {
                                onOut(member.userEmail);
                                setOpenMenuEmail(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 flex items-center gap-2 transition-colors"
                            >
                              <UserMinus size={14} />
                              강퇴하기
                            </button>
                          </div>
                        </>
                      )}
                    </div>
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
