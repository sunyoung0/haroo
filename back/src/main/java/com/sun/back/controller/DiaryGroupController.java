package com.sun.back.controller;

import com.sun.back.dto.diaryGroup.GetMyGroupResponse;
import com.sun.back.dto.diaryGroup.GroupCreateRequest;
import com.sun.back.dto.diaryGroup.NoticeUpdateRequest;
import com.sun.back.service.DiaryGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryGroupController {

    private final DiaryGroupService diaryGroupService;

    // 다이어리 그룹(개인/ 공유) 생성
    @PostMapping("/groups")
    public ResponseEntity<Long> createGroup(@AuthenticationPrincipal String email, @RequestBody GroupCreateRequest dto) {
        Long groupId = diaryGroupService.createGroup(email, dto);
        return ResponseEntity.ok(groupId);
    }

    // 다이어리 그룹(개인/공유) 가져오기
    @GetMapping("/groups")
    public ResponseEntity<List<GetMyGroupResponse>> getGroup(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(diaryGroupService.getMyGroup(email));
    }

    // 다이어리 공지 수정
    @PutMapping("/groups/{groupId}")
    public ResponseEntity<Void> updateNotice(@AuthenticationPrincipal String email, @PathVariable Long groupId, @RequestBody NoticeUpdateRequest dto) {
        diaryGroupService.updateNotice(email, groupId, dto.notice());
        return ResponseEntity.ok().build();
    }

    // 다이어리 그룹 전체 삭제 (방장만 가능)
    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity<Void> deleteGroup(@AuthenticationPrincipal String email, @PathVariable Long groupId) {
        diaryGroupService.deleteGroup(email, groupId);
        return ResponseEntity.ok().build();
    }

    // 다이어리 그룹 탈퇴 (멤버용)
    @DeleteMapping("/groups/leave/{groupId}")
    public ResponseEntity<Void> leaveGroup(@AuthenticationPrincipal String email, @PathVariable Long groupId) {
        diaryGroupService.leaveGroup(email, groupId);
        return ResponseEntity.ok().build();
    }
}