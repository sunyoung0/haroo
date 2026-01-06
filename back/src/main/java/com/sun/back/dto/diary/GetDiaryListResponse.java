package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record GetDiaryListResponse(
        Long id,
        String notice,
        String title,
        String nickname,
        FeelingType feelingType,
        LocalDateTime createdAt,
        LocalDate diaryDate,
        Integer commentCount,
        Integer likeCount
) {}