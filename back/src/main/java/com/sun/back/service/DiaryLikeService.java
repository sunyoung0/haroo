package com.sun.back.service;

import com.sun.back.entity.User;
import com.sun.back.entity.diary.Diary;
import com.sun.back.entity.diary.DiaryLike;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.DiaryLikeRepository;
import com.sun.back.repository.DiaryRepository;
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

    @Transactional
    public String toggle(String email, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기를 찾을 수 없습니다."));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        return diaryLikeRepository.findByDiaryAndUser(diary, user)
                .map(like -> {
                    diaryLikeRepository.delete(like);
                    return "좋아요 취소 완료";
                })
                .orElseGet(() -> {
                    diaryLikeRepository.save(new DiaryLike(diary, user));
                    return "좋아요 완료";
                });
    }
}
