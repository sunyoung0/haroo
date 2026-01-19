package com.sun.back.dto.diaryGroup;

import com.sun.back.enums.MemberRole;

public record GroupMemberListResponse(
        Long userId,
        String userEmail,
        String nickname,
        String joinedAt,
        MemberRole role
) {}