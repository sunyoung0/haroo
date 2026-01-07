package com.sun.back.dto.diaryComment;

import java.time.LocalDateTime;

public record GetCommentResponse(
        Long id,
        String content,
        String nickname
) {}