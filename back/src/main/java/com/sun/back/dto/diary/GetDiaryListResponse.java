package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;

import java.time.LocalDateTime;

public record GetDiaryListResponse(
        Long id,
        String title,
        String nickname,
        FeelingType feelingType,
        LocalDateTime createdAt,
        Integer commentCount,
        Integer likeCount
) {}