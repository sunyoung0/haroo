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
  diaryDate: string;
  commentCount: number;
  likeCount: number;
};

export type GetDiaryDetail = {
  id: number;
  title: string;
  content: string;
  feelingType: string;
  createdAt: string;
  date: string;
  writerEmail: string;
  writerNickname: string;
  commentCount: number;
  likeCount: number;
  isLike: boolean;
};

export type GetCommentList = {
  id: number;
  parentId: number;
  content: string;
  nickname: string;
  createdAt: string;
  isMine: boolean; // 내가 쓴 댓글인지 확인 (삭제 버튼용)
};


export type Notification = {
  id: number;
  message: string;
  type: 'COMMENT' | 'LIKE' | 'GROUP_INVITE';
  sender: string;
  url: string;
  createdAt:string;
  isRead: boolean;
}

export type SnackbarType = "success" | "error" | "warning";