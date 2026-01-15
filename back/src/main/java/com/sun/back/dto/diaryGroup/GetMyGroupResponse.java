package com.sun.back.dto.diaryGroup;

import com.sun.back.enums.GroupType;
import com.sun.back.enums.MemberRole;

public record GetMyGroupResponse(
        Long id,
        String title,
        MemberRole role,
        GroupType type,
        Integer membersCount
){}
