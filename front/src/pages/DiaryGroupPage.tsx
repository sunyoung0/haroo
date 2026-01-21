import { Pin, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSnackbar } from "../context/SnackbarContext";
import { useAuthStore } from "../store/useAuthStore";
import api from "../api/axiosInstance";
import axios from "axios";

import GroupHeader from "../components/diaryGroupPage/GroupHeader";
import GroupTabs from "../components/diaryGroupPage/GroupTabs";
import DiaryCard from "../components/diaryGroupPage/DiaryCard";
import CalendarView from "../components/diaryGroupPage/CalendarView";
import MemberListView from "../components/diaryGroupPage/MemberListView";
import InviteMemberModal from "../components/modals/MemberInviteModal";
import EditNoticeModal from "../components/modals/EditNoticeModal";

import { diaryGroupList } from "../types/types";
import { MemberList } from "../types/types";

const DiaryGroupPage = () => {
  const { groupId } = useParams();
  const { userEmail } = useAuthStore(); // Zustand에서 로그인 유저 정보 가져오기
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // 상태 관리
  const [activeTab, setActiveTab] = useState("feed"); // feed, calendar, members
  const [diariesList, setDiariesList] = useState<diaryGroupList[]>([]);
  const [groupInfo, setGroupInfo] = useState({ title: "", notice: "" });
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState(""); // 수정할 공지 내용
  const [members, setMembers] = useState<MemberList[]>([]);

  // 내가 방장인지 확인
  const isOwner =
    members.find((m) => m.userEmail === userEmail)?.role === "OWNER";

  const getDiaries = async () => {
    try {
      const response = await api.get(`/diaries/${groupId}`);
      setDiariesList(response.data.diaries || []);
      setGroupInfo({
        title: response.data.groupTitle,
        notice: response.data.groupNotice,
      });
    } catch (error) {
      console.log("에러 발생 : ", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "다이어리를 불러오는 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 403) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleUpdateNotice = async () => {
    try {
      await api.put(`/groups/${groupId}`, {
        notice: newNotice,
      });
      setGroupInfo((prev) => ({ ...prev, notice: newNotice }));
      setIsNoticeModalOpen(false);
      showSnackbar("공지사항이 수정되었습니다.", "success");
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "공지사항 수정 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 400) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/groups/members/${groupId}`);
      setMembers(response.data);
    } catch (error) {
      console.error("멤버 리스트를 불러오는 중 오류 발생 :", error);
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "멤버 리스트를 불러오는 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 400) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleMemberInvite = async () => {
    try {
      await api.post(`/groups/members/${groupId}`, { email: inviteEmail });
      showSnackbar("멤버를 성공적으로 초대했습니다!", "success");
      setInviteEmail("");
      setIsInviteModalOpen(false);
      fetchMembers();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "멤버를 초대하는 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 400) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 403) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleDeleteOrLeave = async () => {
    const message = isOwner
      ? "다이어리 그룹 전체를 삭제하시겠습니까?"
      : "이 그룹에서 탈퇴하시겠습니까?";

    if (!window.confirm(message)) return;

    try {
      if (isOwner) {
        // 방장인 경우
        await api.delete(`/groups/${groupId}`);
        showSnackbar("그룹이 삭제되었습니다.", "success");
      } else {
        // 멤버인 경우
        await api.delete(`/groups/leave/${groupId}`);
        showSnackbar("그룹에서 탈퇴했습니다.", "success");
      }
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "다이어리 삭제/탈퇴 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 400) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 403) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  const handleOutMember = async (targetEmail: string) => {
    if (!window.confirm(`${targetEmail}님을 그룹에서 강퇴하시겠습니까?`))
      return;

    try {
      await api.delete(
        `/groups/members/out/${groupId}?targetEmail=${targetEmail}`,
      );
      showSnackbar("멤버를 강퇴했습니다.", "success");
      fetchMembers(); // 목록 새로고침
    } catch (error) {
      showSnackbar("강퇴 처리에 실패했습니다.", "error");
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message || "멤버 강퇴 중 오류가 발생했습니다.";
        const status = error.response?.status;
        if (status === 400) {
          showSnackbar(serverMessage, "warning");
        } else if (status === 404) {
          showSnackbar(serverMessage, "warning");
        } else {
          showSnackbar("예상치 못한 오류가 발생했습니다.", "error");
          console.error("Unknown error:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (groupId) {
      getDiaries();
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-sm flex flex-col">
        <GroupHeader
          title={groupInfo.title}
          isOwner={isOwner}
          onEditNotice={() => {
            setNewNotice(groupInfo.notice); // 기존 공지 세팅
            setIsNoticeModalOpen(true); // 모달 열기
          }}
          onDeleteOrLeave={handleDeleteOrLeave}
        />

        {/* 공지사항 */}
        <div className="p-4 bg-white pb-2">
          <div className="w-full py-3 px-4 rounded-2xl border border-sky-100 bg-sky-50/50 flex items-center justify-center gap-2 text-sky-600 font-semibold shadow-sm">
            <Pin size={18} className="shrink-0" />
            <span className="truncate">
              {groupInfo.notice || "공지사항이 없습니다."}
            </span>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <GroupTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
          {activeTab === "feed" && (
            <>
              {diariesList.length > 0 ? (
                diariesList.map((diary) => (
                  <DiaryCard key={diary.id} diary={diary} />
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                  아직 작성된 일기가 없습니다.
                </div>
              )}
            </>
          )}

          {activeTab === "calendar" && <CalendarView diaries={diariesList} />}

          {activeTab === "members" && (
            <MemberListView
              members={members}
              onInvite={() => setIsInviteModalOpen(true)}
              isOwner={isOwner} // 내가 방장인지 여부 전달
              currentUserEmail={userEmail}
              onOut={handleOutMember}
            />
          )}

          <div className="h-10" />
        </main>

        {/* 멤버 초대 모달 */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          onSendInvite={handleMemberInvite}
        />
        {/* 공지사항 수정 모달 */}
        <EditNoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
          notice={newNotice}
          setNotice={setNewNotice}
          onUpdate={handleUpdateNotice}
        />
        {/* 새 일기 작성 플로팅 버튼*/}
        <button
          onClick={() => navigate(`/diaries/write/${groupId}`)} // 작성 페이지 경로로 이동
          className="fixed bottom-8 right-[calc(50%-300px)] w-14 h-14 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-all flex items-center justify-center z-50 hover:scale-110 active:scale-95 shadow-sky-200"
          title="새 일기 작성"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default DiaryGroupPage;