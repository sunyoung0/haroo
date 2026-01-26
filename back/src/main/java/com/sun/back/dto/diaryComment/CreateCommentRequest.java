package com.sun.back.dto.diaryComment;

public record CreateCommentRequest(
        Long diaryId,
        Long parentId,
        String content
) {}