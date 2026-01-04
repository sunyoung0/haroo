package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;

import java.time.LocalDateTime;

public record GetDiaryDetailResponse(
   Long id,
   String title,
   String content,
   FeelingType feelingType,
   LocalDateTime createdAt,
   String writerNickname
   // 추후에 댓글, 좋아요 리스트 포함
) {}
