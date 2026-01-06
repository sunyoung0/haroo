package com.sun.back.controller;

import com.sun.back.dto.diaryComment.CreateCommentRequest;
import com.sun.back.dto.diaryComment.GetCommentResponse;
import com.sun.back.service.DiaryCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryCommentController {

    private final DiaryCommentService diaryCommentService;

    // 댓글 작성
    @PostMapping("/diaries/comment/{diary_id}")
    public ResponseEntity<Void> createComment(@AuthenticationPrincipal String email, @PathVariable Long diaryId, @RequestBody CreateCommentRequest dto) {
        diaryCommentService.createComment(email, diaryId, dto);
        return ResponseEntity.ok().build();
    }

    // 댓글 조회
    @GetMapping("/diaries/comment/{diary_id}")
    public ResponseEntity<List<GetCommentResponse>> getComment(@AuthenticationPrincipal String email, @PathVariable Long diaryId) {
        return ResponseEntity.ok(diaryCommentService.getComment(email,diaryId));
    }

    // 댓글 수정
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<Void> updateComment(@AuthenticationPrincipal String email, @PathVariable Long commentId, @RequestBody CreateCommentRequest dto) {
        diaryCommentService.updateComment(email, commentId, dto);
        return ResponseEntity.ok().build();
    }

    // 댓글 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal String email, @PathVariable Long commentId) {
        diaryCommentService.deleteComment(email, commentId);
        return ResponseEntity.ok().build();
    }
}