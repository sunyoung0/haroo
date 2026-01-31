package com.sun.back.dto.diary;

import com.sun.back.entity.diary.Diary;
import com.sun.back.enums.FeelingType;
import org.springframework.format.annotation.DateTimeFormat;

public record TempDiaryResponse(
        Long diaryId,   // 수정 시 필요 (첫 저장 시 null)
        Long groupId,   // 어떤 그룹에 쓰는지
        String title,
        String content,
        @DateTimeFormat(pattern = "yyyy-MM-dd") // 날짜를 안보내면 서버에서 오늘 날짜로 처리
        String diaryDate,
        FeelingType feelingType) {

    public static TempDiaryResponse from(Diary diary) {
        return new TempDiaryResponse(
            diary.getId(),
            diary.getDiaryGroup().getId(),
            diary.getTitle(),
            diary.getContent(),
            diary.getDiaryDate(),
            diary.getFeelingType()
        );
    }
}
