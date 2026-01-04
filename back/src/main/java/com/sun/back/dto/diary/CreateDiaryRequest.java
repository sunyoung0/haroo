package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;

public record CreateDiaryRequest(
        String title,
        String content,
        FeelingType feelingType
) {}
