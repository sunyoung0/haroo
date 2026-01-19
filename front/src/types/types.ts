export type MemberList = {
  userId: number;
  userEmail: string;
  nickname: string;
  role: "OWNER" | "MEMBER";
  joinedAt?: string;
}

export type CreateDiaryRequest = {
  title: string;
  description: string;
  type: "PERSONAL" | "SHARED";
}

export type DiaryGroup = {
  id: number;
  title: string;
  type: "PERSONAL" | "SHARED";
  createdAt: string;
  membersCount: number;
  role: "OWNER" | "MEMBER";
};

export type diaryGroupList = {
  id: number;
  notice: string;
  title: string;
  nickname: string;
  feelingType: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
};

export type SnackbarType = "success" | "error" | "warning";