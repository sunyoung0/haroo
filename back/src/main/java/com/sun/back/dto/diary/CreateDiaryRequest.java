package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record CreateDiaryRequest(
        String title,
        String content,
        @DateTimeFormat(pattern = "yyyy-MM-dd") // 날짜를 안보내면 서버에서 오늘 날짜로 처리
        LocalDate diaryDate,
        FeelingType feelingType
) {}
