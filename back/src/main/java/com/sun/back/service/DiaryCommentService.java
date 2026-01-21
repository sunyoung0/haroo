package com.sun.back.service;

import com.sun.back.dto.diaryComment.CreateCommentRequest;
import com.sun.back.dto.diaryComment.GetCommentResponse;
import com.sun.back.entity.User;
import com.sun.back.entity.diary.Diary;
import com.sun.back.entity.diary.DiaryComment;
import com.sun.back.enums.NotificationType;
import com.sun.back.exception.DiaryAccessException;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.DiaryCommentRepository;
import com.sun.back.repository.DiaryMemberRepository;
import com.sun.back.repository.DiaryRepository;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryCommentService {

    private final DiaryCommentRepository diaryCommentRepository;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final DiaryMemberRepository diaryMemberRepository;
    private final NotificationService notificationService;

    // 다이어리 댓글 작성
    @Transactional
    public void createComment(String email, Long diaryId, CreateCommentRequest dto) {
        // 일기 존재 확인
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기가 존재하지 않습니다."));

        // 작성자 존재 확인
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("유저가 존재하지 않습니다."));

        // 권한 체크 : 이 일기가 속한 그룹의 멤버인지
        if (!diaryMemberRepository.existsByUser_EmailAndDiaryGroup_Id(email, diary.getDiaryGroup().getId()) ) {
            throw new DiaryAccessException("댓글을 달 권한이 없습니다.");
        }

        // 댓글 저장
        DiaryComment comment = DiaryComment.builder()
                .content(dto.content())
                .diary(diary)
                .user(user)
                .build();

        diaryCommentRepository.save(comment);

        // 알림 발송
        notificationService.send(diary.getUser(), NotificationType.COMMENT, user.getNickname(), (user.getNickname() + "님이 내 일기에 댓글을 남겼습니다." ), ("/diaries/comment/"+diaryId));

    }

    // 댓글 조회
    @Transactional(readOnly = true)
    public List<GetCommentResponse> getComment(String email, Long diaryId) {
        // 현재 로그인한 유저 조회
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 일기 존재 및 권한 체크
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기가 존재하지 않습니다."));

        if (!diaryMemberRepository.existsByUser_EmailAndDiaryGroup_Id(email, diary.getDiaryGroup().getId())) {
            throw new DiaryAccessException("댓글을 조회할 권한이 없습니다.");
        }

        // 해당 일기의 댓글 리스트 조회
        List<DiaryComment> comments = diaryCommentRepository.findAllByDiaryIdOrderByCreatedAtAsc(diaryId);

        // dto 변환
        return comments.stream()
                .map(c -> new GetCommentResponse(
                        c.getId(),
                        c.getContent(),
                        c.getUser().getNickname(),
                        c.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        c.getUser().getId().equals(currentUser.getId())
                )).toList();
    }

    // 댓글 수정
    @Transactional
    public void updateComment(String email, Long commentId, CreateCommentRequest dto) {
        // 댓글 존재 확인
        DiaryComment comment = diaryCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글이 존재하지 않습니다."));

        // 작성자 권한 체크
        if (!comment.getUser().getEmail().equals(email)) {
            throw new DiaryAccessException("본인이 작성한 댓글만 수정할 수 있습니다.");
        }

        // 내용 수정
        comment.updateDiaryComment(dto.content());
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(String email, Long commentId) {
        // 1. 댓글 존재 확인
        DiaryComment comment = diaryCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 댓글입니다."));

        // 2. 작성자 권한 체크 (또는 방장도 삭제 가능하게 하려면 로직 추가 가능)
        if (!comment.getUser().getEmail().equals(email)) {
            throw new DiaryAccessException("본인이 작성한 댓글만 삭제할 수 있습니다.");
        }

        // 3. 삭제 실행
        diaryCommentRepository.delete(comment);
    }
}
