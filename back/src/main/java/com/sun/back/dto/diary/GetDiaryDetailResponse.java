package com.sun.back.dto.diary;

import com.sun.back.enums.FeelingType;

import java.time.LocalDateTime;

public record GetDiaryDetailResponse(
   Long id,
   String title,
   String content,
   FeelingType feelingType,
   LocalDateTime createdAt,
   String date,
   String email,
   String writerNickname,
   Integer commentCount,
   Integer likeCount,
   boolean isLike
) {}
