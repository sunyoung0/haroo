package com.sun.back.dto.diaryComment;

public record GetCommentResponse(
        Long id,
        String content,
        String nickname,
        String createdAt,
        boolean isMine
) {}