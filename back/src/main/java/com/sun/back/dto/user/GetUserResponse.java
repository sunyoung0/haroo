package com.sun.back.dto.user;

import com.sun.back.dto.diary.GroupDiaryResponse;

import java.util.List;

public record GetUserResponse(
        Long id,
        String email,
        String nickname,
        List<GroupDiaryResponse> groups
){}
