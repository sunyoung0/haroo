package com.sun.back.service;

import com.sun.back.dto.diary.CreateDiaryRequest;
import com.sun.back.dto.diary.GetDiaryDetailResponse;
import com.sun.back.dto.diary.GetDiaryListResponse;
import com.sun.back.dto.diary.PatchDiaryRequest;
import com.sun.back.entity.User;
import com.sun.back.entity.diary.Diary;
import com.sun.back.entity.diary.DiaryGroup;
import com.sun.back.exception.DiaryAccessException;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final DiaryGroupRepository diaryGroupRepository;
    private final DiaryMemberRepository diaryMemberRepository;
    private final UserRepository userRepository;
    private final DiaryCommentRepository diaryCommentRepository;
    private final DiaryLikeRepository diaryLikeRepository;

    // 일기 작성
    @Transactional
    public String createDiary(String email, Long groupId, CreateDiaryRequest dto) {

        // 작성자 존재 확인
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 그룹 존재 확인
        DiaryGroup group = diaryGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("다이어리 그룹이 존재하지 않습니다."));

        // 권한 체크 : 유저가 해당 그룹의 멤버인지 확인
        boolean isMember = diaryMemberRepository.existsByUserAndDiaryGroup_Id(user, groupId);

        if(!isMember) {
            throw new DiaryAccessException("해당 다이어리에 글을 쓸 권한이 없습니다.");
        }

        LocalDate targetDate = (dto.diaryDate() == null) ? LocalDate.now() : dto.diaryDate();

        // 일기 저장
        Diary diary = Diary.builder()
                .diaryGroup(group)
                .user(user)
                .title(dto.title())
                .content(dto.content())
                .diaryDate(dto.diaryDate())
                .feelingType(dto.feelingType())
                .build();

        diaryRepository.save(diary);

        return "일기 작성이 완료되었습니다.";
    }

    // 해당 그룹에서 일기 리스트 조회
    @Transactional(readOnly = true)
    public List<GetDiaryListResponse> getGroupDiaries(String email, Long groupId, LocalDate diaryDate, Long memberId) {
        // 작성자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 권한 체크
        if(!diaryMemberRepository.existsByUserAndDiaryGroup_Id(user,groupId)) {
            throw new DiaryAccessException("해당 다이어리를 볼 권한이 없습니다.");
        }

        // 해당 그룹 일기 리스트 불러오기
        List<Diary> diaries = diaryRepository.findFilteredDiaries(groupId, memberId, diaryDate);

        return diaries.stream()
                .map(d -> new GetDiaryListResponse(
                        d.getId(),
                        d.getDiaryGroup().getNotice(),
                        d.getTitle(),
                        d.getUser().getNickname(),
                        d.getFeelingType(),
                        d.getCreatedAt(),
                        d.getDiaryDate(),
                        d.getComments().size(),
                        d.getLikes().size()
                )).toList();
    }

    // 일기 상세 정보 조회
    @Transactional(readOnly = true)
    public GetDiaryDetailResponse getDiaryDetail(String email, Long diaryId) {
        // 작성자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 일기 조회
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 일기입니다."));

        // 권한 체크
        if (!diaryMemberRepository.existsByUserAndDiaryGroup_Id(user, diary.getDiaryGroup().getId())) {
            throw new DiaryAccessException("이 일기를 볼 권한이 없습니다.");
        }

        // 전체 댓글 개수 조회
        int commentCount = diaryCommentRepository.countByDiaryId(diaryId);

        // 좋아요 정보 가져오기
        // 전체 좋아요 개수 조회
        int likeCount = diaryLikeRepository.countByDiaryId(diaryId);

        // 현재 접속한 유저가 좋아요 눌렀는 지 확인
        boolean isLiked = false;
        if (email != null) {
            isLiked = diaryLikeRepository.existsByDiaryAndUser_email(diary, email);
        }

        // DTO 변환 및 return
        return new GetDiaryDetailResponse(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getFeelingType(),
                diary.getCreatedAt(),
                diary.getUser().getNickname(),
                commentCount,
                likeCount,
                isLiked
        );
    }

    // 일기 수정
    @Transactional
    public void updateDiary(String email, Long diaryId, PatchDiaryRequest dto) {
        // 일기 조회
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 일기입니다."));

        // 작성자 권한 체크 (로그인한 유저와 작성자가 같은지)
        if (!diary.getUser().getEmail().equals(email)) {
            throw new DiaryAccessException("본인이 작성한 일기만 수정 가능합니다.");
        }

        // 엔티티 업데이트
        diary.updateDiary(dto.title(), dto.content(), dto.feelingType());
    }

    @Transactional
    public void deleteDiary(String email, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 일기입니다."));

        // 작성자 권한 체크 (로그인한 유저와 작성자가 같은지)
        if (!diary.getUser().getEmail().equals(email)) {
            throw new DiaryAccessException("본인이 작성한 일기만 수정 가능합니다.");
        }
        diaryRepository.delete(diary);
    }
}
