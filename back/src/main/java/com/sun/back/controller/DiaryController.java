package com.sun.back.controller;

import com.sun.back.dto.diary.CreateDiaryRequest;
import com.sun.back.dto.diary.GetDiaryDetailResponse;
import com.sun.back.dto.diary.GetDiaryListResponse;
import com.sun.back.dto.diary.PatchDiaryRequest;
import com.sun.back.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    // 일기 작성
    @PostMapping("/createDiary/{groupId}")
    public ResponseEntity<String> crateDiary(@AuthenticationPrincipal String email, @PathVariable Long groupId, @RequestBody CreateDiaryRequest dto) {
        return ResponseEntity.ok(diaryService.createDiary(email, groupId, dto));
    }

    // 해당 그룹의 일기 리스트 불러오기
    @GetMapping("/getDiaries/{groupId}")
    public ResponseEntity<List<GetDiaryListResponse>> getDiaries(@AuthenticationPrincipal String email, @PathVariable Long groupId) {
        return ResponseEntity.ok(diaryService.getGroupDiaries(email, groupId));
    }

    // 일기 상세 내용 조회
    @GetMapping("/getDiariesDetail/{diaryId}")
    public ResponseEntity<GetDiaryDetailResponse> getDiaryDetail(@AuthenticationPrincipal String email, @PathVariable Long diaryId) {
        return ResponseEntity.ok(diaryService.getDiaryDetail(email, diaryId));
    }

    // 일기 수정
    @PutMapping("/diaries/{diaryId}")
    public ResponseEntity<Void> updateDiary(@AuthenticationPrincipal String email, @PathVariable Long diaryId, @RequestBody PatchDiaryRequest dto) {
        diaryService.updateDiary(email, diaryId, dto);
        return ResponseEntity.ok().build();
    }

    // 일기 삭제
    @DeleteMapping("/diaries/{diaryId}")
    public ResponseEntity<Void> deleteDiary(@AuthenticationPrincipal String email, @PathVariable Long diaryId) {
        diaryService.deleteDiary(email, diaryId);
        return ResponseEntity.ok().build();
    }

}
