package com.sun.back.repository;

import com.sun.back.entity.User;
import com.sun.back.entity.diary.Diary;
import com.sun.back.entity.diary.DiaryLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiaryLikeRepository extends JpaRepository<DiaryLike, Long> {
    Optional<DiaryLike> findByDiaryAndUser(Diary diary, User user);
    boolean existsByDiaryAndUser(Diary diary, User user);
    int countByDiaryId(Long diaryId);

    boolean existsByDiaryAndUser_email(Diary diary, String email);
}
