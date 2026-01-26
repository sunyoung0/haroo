package com.sun.back.service;

import com.sun.back.entity.User;
import com.sun.back.entity.diary.Diary;
import com.sun.back.entity.diary.DiaryLike;
import com.sun.back.enums.NotificationType;
import com.sun.back.exception.DiaryGroupException;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.DiaryLikeRepository;
import com.sun.back.repository.DiaryRepository;
import com.sun.back.repository.NotificationRepository;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiaryLikeService {

    private final DiaryLikeRepository diaryLikeRepository;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Transactional
    public String toggle(String email, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기를 찾을 수 없습니다."));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 본인 글인지 확인
        if (diary.getUser().getEmail().equals(email)) {
            throw new DiaryGroupException("본인의 글에는 좋아요를 누를 수 없습니다.");
        }

        return diaryLikeRepository.findByDiaryAndUser(diary, user)
                .map(like -> {
                    diaryLikeRepository.delete(like);
                    notificationRepository.deleteByTargetIdAndType(diaryId, NotificationType.LIKE);
                    return "좋아요 취소 완료";
                })
                .orElseGet(() -> {
                    diaryLikeRepository.save(new DiaryLike(diary, user));
                    // 알림 발송
                    notificationService.send(diary.getUser(), NotificationType.LIKE, user.getNickname(), (user.getNickname() + "님이 내 일기에 좋아요를 남겼습니다." ), ("/diaries/like/" + diaryId), diaryId);

                    return "좋아요 완료";
                });
    }
}
