package com.sun.back.controller;

import com.sun.back.dto.diaryGroup.GroupMemberListResponse;
import com.sun.back.dto.diaryGroup.MemberInviteRequest;
import com.sun.back.service.DiaryMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryMemberController {

    private final DiaryMemberService diaryMemberService;

    // 다이어리 그룹 멤버 초대
    @PostMapping("/group/invite/{groupId}")
    public ResponseEntity<Void> inviteMember(@AuthenticationPrincipal String email, @PathVariable Long groupId, @RequestBody MemberInviteRequest dto) {
        diaryMemberService.inviteMember(email, groupId, dto);
        return ResponseEntity.ok().build();
    }

    // 다이어리 그룹 멤버 조회
    @GetMapping("/group/memberList/{groupId}")
    public ResponseEntity<List<GroupMemberListResponse>> getGroupMemberList(@PathVariable Long groupId) {
        return ResponseEntity.ok(diaryMemberService.getGroupMemberList(groupId));
    }
}
