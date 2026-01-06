package com.sun.back.controller;

import com.sun.back.repository.DiaryLikeRepository;
import com.sun.back.service.DiaryLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DiaryLikeController {

    private final DiaryLikeService diaryLikeService;

    @PostMapping("/diaries/like/{diaryId}")
    public ResponseEntity<String> toggleLike(@AuthenticationPrincipal String email, @PathVariable Long diaryId) {
        return ResponseEntity.ok(diaryLikeService.toggle(email, diaryId));
    }
}
