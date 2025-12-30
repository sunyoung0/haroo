package com.sun.back.controller;

import com.sun.back.dto.diary.GroupCreateRequest;
import com.sun.back.service.DiaryGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DiaryGroupController {

    private final DiaryGroupService diaryGroupService;

    // 다이어리 그룹(개인/ 공유) 생성
    @PostMapping("/group")
    public ResponseEntity<Long> createGroup(@AuthenticationPrincipal String email, @RequestBody GroupCreateRequest dto) {
        Long groupId = diaryGroupService.CreateGroup(email, dto);
        return ResponseEntity.ok(groupId);
    }


}


