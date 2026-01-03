package com.sun.back.dto.diaryGroup;

import com.sun.back.entity.enums.GroupType;
import com.sun.back.entity.enums.MemberRole;

public record GetMyGroupResponse(
        Long id,
        String title,
        MemberRole role,
        GroupType groupType,
        Long membersCount
){}
