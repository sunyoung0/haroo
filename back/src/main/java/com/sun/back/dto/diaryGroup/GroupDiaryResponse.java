package com.sun.back.dto.diaryGroup;

import com.sun.back.enums.GroupType;
import com.sun.back.enums.MemberRole;

public record GroupDiaryResponse(
        Long groupId,
        String title,
        GroupType type,
        MemberRole role
){}