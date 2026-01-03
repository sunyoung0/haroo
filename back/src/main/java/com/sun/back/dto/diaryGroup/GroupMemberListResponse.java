package com.sun.back.dto.diaryGroup;

import com.sun.back.entity.enums.MemberRole;

public record GroupMemberListResponse(
        Long userId,
        String nickname,
        MemberRole role
) {}
