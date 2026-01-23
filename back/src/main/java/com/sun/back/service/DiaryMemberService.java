package com.sun.back.service;

import com.sun.back.dto.diaryGroup.GroupMemberListResponse;
import com.sun.back.dto.diaryGroup.MemberInviteRequest;
import com.sun.back.entity.User;
import com.sun.back.entity.diary.DiaryGroup;
import com.sun.back.entity.diary.DiaryMember;
import com.sun.back.enums.GroupType;
import com.sun.back.enums.MemberRole;
import com.sun.back.enums.NotificationType;
import com.sun.back.exception.DiaryAccessException;
import com.sun.back.exception.DiaryGroupException;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.DiaryGroupRepository;
import com.sun.back.repository.DiaryMemberRepository;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryMemberService {

    private final UserRepository userRepository;
    private final DiaryMemberRepository diaryMemberRepository;
    private final DiaryGroupRepository diaryGroupRepository;
    private final NotificationService notificationService;

    // 멤버 초대
    @Transactional
    public void inviteMember(String ownerEmail, Long groupId, MemberInviteRequest dto) {
        // 방장 권한 확인
        DiaryMember owner = diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(ownerEmail, groupId)
                .orElseThrow(() -> new DiaryAccessException("해당 그룹에 접근 권한이 없는 유저입니다."));

        if (owner.getDiaryGroup().getType() != GroupType.SHARED) {
            throw new DiaryGroupException("개인 다이어리는 멤버 초대를 할 수 없습니다.");
        }

        if (owner.getRole() != MemberRole.OWNER) {
            throw new DiaryAccessException("초대 권한이 없습니다.");
        }

        // 초대할 유저가 존재하는지 확인
        User invitee = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new ResourceNotFoundException("초대하려는 멤버가 존재하지 않습니다."));

        // 이미 그룹 멤버인지 확인
        if (diaryMemberRepository.existsByUserAndDiaryGroup_Id(invitee, groupId)) {
            throw new DiaryGroupException("이미 그룹에 가입되어있는 멤버입니다.");
        }

        // 멤버로 추가
        DiaryGroup group = diaryGroupRepository.findById(groupId).orElseThrow();

        DiaryMember newMember = DiaryMember.builder()
                .diaryGroup(group)
                .user(invitee)
                .role(MemberRole.MEMBER)
                .build();

        diaryMemberRepository.save(newMember);
        // 알림 발송
        notificationService.send(invitee, NotificationType.GROUP_INVITE, owner.getUser().getNickname(), (owner.getUser().getNickname() + "님이 그룹에 초대하셨습니다." ), ("/groups/members/" + groupId));

    }

    // 해당 그룹의 멤버 리스트 조회
    @Transactional
    public List<GroupMemberListResponse> getGroupMemberList(Long groupId) {
        // 그룹 존재 여부 확인
        if (!diaryGroupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("해당 다이어리가 존재하지 않습니다.");
        }

        // 해당 그룹에 속한 모든 멤버 조회
        List<DiaryMember> members = diaryMemberRepository.findAllByDiaryGroup_Id(groupId);

        // Dto 변환
        return members.stream()
                .map(m -> new GroupMemberListResponse(
                        m.getUser().getId(),
                        m.getUser().getEmail(),
                        m.getUser().getNickname(),
                        m.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy. MM. dd")),
                        m.getRole()
                )).toList();
    }

    // 멤버 탈퇴 기능
    @Transactional
    public void outMember(Long groupId, String adminEmail, String targetEmail) {
        // 방장 권한 확인
        DiaryMember admin = diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(adminEmail, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("그룹 멤버가 아닙니다."));

        if (!admin.getRole().equals(MemberRole.OWNER)) {
            throw new DiaryAccessException("방장만 멤버를 강퇴할 수 있습니다.");
        }

        // 2. 자신을 강퇴하는지 확인
        if (adminEmail.equals(targetEmail)) {
            throw new DiaryGroupException("본인은 강퇴할 수 없습니다.");
        }

        // 3. 대상 삭제
        DiaryMember target = diaryMemberRepository.findByUser_EmailAndDiaryGroup_Id(targetEmail, groupId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 멤버를 찾을 수 없습니다."));

        diaryMemberRepository.delete(target);
    }
}