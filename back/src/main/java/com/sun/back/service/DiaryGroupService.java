package com.sun.back.service;

import com.sun.back.dto.diary.GetMyGroupResponse;
import com.sun.back.dto.diary.GroupCreateRequest;
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
}
