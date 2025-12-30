package com.sun.back.dto.diary;

import com.sun.back.entity.enums.GroupType;
import com.sun.back.entity.enums.MemberRole;

public record GroupDiaryResponse(
        Long groupId,
        String title,
        GroupType type,
        MemberRole role
){}