package com.sun.back.controller;

import com.sun.back.dto.diary.*;
import com.sun.back.entity.diary.Diary;
import com.sun.back.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    // 일기 작성
    @PostMapping("/diaries/{groupId}")
    public ResponseEntity<String> crateDiary(@AuthenticationPrincipal String email, @PathVariable Long groupId, @RequestBody CreateDiaryRequest dto) {
        return ResponseEntity.ok(diaryService.createDiary(email, groupId, dto));
    }

    // 일기 임시 저장
    @PostMapping("/diaries/temp")
    public ResponseEntity<Long> tempSave(@AuthenticationPrincipal String email, @RequestBody DiaryTempRequest dto) {
        return ResponseEntity.ok(diaryService.tempSaveDiary(email, dto));
    }

    // 해당 그룹의 일기 리스트 불러오기
    @GetMapping("/diaries/{groupId}")
    public ResponseEntity<GroupDiaryResponse> getDiaries(@AuthenticationPrincipal String email, @PathVariable Long groupId, @RequestParam(required = false) LocalDate diaryDate, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(diaryService.getGroupDiaries(email, groupId, diaryDate, userId));
    }

    // 일기 상세 내용 조회
    @GetMapping("/diaries/detail/{diaryId}")
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

    // 캘린더용 날짜 조회
    @GetMapping("/diaries/dates/{groupId}")
    public ResponseEntity<List<String>> getDiaryDates(
            @PathVariable Long groupId,
            @RequestParam String diaryDate
    ) {
        return ResponseEntity.ok(diaryService.getDiaryDatesInMonth(groupId, diaryDate));
    }
}
