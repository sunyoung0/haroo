package com.sun.back.service;

import com.sun.back.dto.diaryGroup.GetMyGroupResponse;
import com.sun.back.dto.diaryGroup.GroupCreateRequest;
import com.sun.back.dto.diaryGroup.MemberInviteRequest;
import com.sun.back.entity.User;
import com.sun.back.entity.diary.DiaryGroup;
import com.sun.back.entity.diary.DiaryMember;
import com.sun.back.entity.enums.MemberRole;
import com.sun.back.repository.DiaryGroupRepository;
import com.sun.back.repository.DiaryMemberRepository;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryGroupService {

    private final UserRepository userRepository;
    private final DiaryGroupRepository diaryGroupRepository;
    private final DiaryMemberRepository diaryMemberRepository;

    // 다이어리 그룹 생성
    @Transactional
    public Long CreateGroup(String email, GroupCreateRequest dto) {
        // 생성자 유저 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 다이어리 그룹 엔티티 생성 및 저장
        DiaryGroup group = DiaryGroup.builder()
                .title(dto.title())
                .notice(dto.notice())
                .type(dto.type())
                .user(user)
                .build();
        DiaryGroup savedGroup = diaryGroupRepository.save(group);

        // 생성자를 해당 그룹의 OWNER 멤버로 자동 등록
        DiaryMember member = DiaryMember.builder()
                .diaryGroup(savedGroup)
                .user(user)
                .role(MemberRole.OWNER) // 생성자는 기본적으로 OWNER 권한
                .build();
        diaryMemberRepository.save(member);

        return savedGroup.getId();
    }

    // 내가 참여하고 있는 다이어리 그룹 목록 불러오기
    @Transactional(readOnly = true)
    public List<GetMyGroupResponse> getMyGroup(String email) {
        // 생성자 유저 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 유저가 참여하고 있는 다이어리 그룹 목록 불러오기
        List<DiaryMember> members = diaryMemberRepository.findAllByUserWithGroup(user);

        return members.stream()
                .map(m -> new GetMyGroupResponse(
                        m.getDiaryGroup().getId(),
                        m.getDiaryGroup().getTitle(),
                        m.getRole(),
                        m.getDiaryGroup().getType(),
                        0L // 일단 0으로 두고, 나중에 멤버 수 집계 로직 추가 가능
                ))
                .toList();
    }

    // 다이어리 공지 수정
    @Transactional
    public void updateNotice(String email, Long groupId, String newNotice) {
        // 해당 그룹 멤버인지 확인
        diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(email, groupId)
                .orElseThrow(() -> new RuntimeException("해당 그룹 멤버가 아닙니다."));

        // 공지 수정
        DiaryGroup group = diaryGroupRepository.findById(groupId).orElseThrow();
        group.updateNotice(newNotice);
    }

    // 다이어리 그룹 삭제 (방장만 가능)
    @Transactional
    public void deleteGroup(String email, Long groupId) {
        // 그룹 조회
        DiaryGroup group = diaryGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("삭제하려는 그룹이 없습니다."));

        // 권한 확인 : 방장만 삭제 가능하므로 OWNER인지 확인
        DiaryMember member = diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(email, groupId)
                .orElseThrow(() -> new RuntimeException("그룹 멤버가 아닙니다."));

        if (member.getRole() != MemberRole.OWNER) {
            throw new RuntimeException("방장만 그룹을 삭제할 수 있습니다.");
        }

        // 그룹 삭제 (연관된 일기, 멤버 모두 삭제)
        diaryGroupRepository.delete(group);
    }

    // 다이어리 그룹 탈퇴 (멤버용)
    @Transactional
    public void leaveGroup(String email, Long groupId) {
        // 탈퇴하려는 멤버 데이터 조회
        DiaryMember member = diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(email, groupId)
                .orElseThrow(() -> new RuntimeException("해당 그룹의 멤버가 아닙니다."));

        // 방장은 탈퇴 불가능
        if (member.getRole() == MemberRole.OWNER) {
            throw new RuntimeException("방장은 그룹을 탈퇴할 수 없습니다.");
        }

        // 멤버만 삭제
        diaryMemberRepository.delete(member);
    }
}