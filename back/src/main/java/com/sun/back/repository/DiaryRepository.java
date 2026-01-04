package com.sun.back.repository;

import com.sun.back.entity.diary.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    // DiaryGroup 엔티티 안에 있는 id 필드와 비교하겠다는 뜻 (중간에 _ 사용)
//    List<Diary> findAllByDiaryGroup_IdOrderByCreatedAtDesc(Long groupId);

    @Query("SELECT d FROM Diary d JOIN FETCH d.user WHERE d.diaryGroup.id = :groupId ORDER BY d.createdAt DESC")
    List<Diary> findAllByGroupIdWithUser(@Param("groupId") Long groupId);

    @Query("SELECT d FROM Diary d WHERE d.diaryGroup.id = :groupId " +
            "AND (:userId IS NULL OR d.user.id = :userId) " +
            "AND (:createdAt IS NULL OR FUNCTION('DATE_FORMAT', d.createdAt, '%Y-%m-%d') = :createdAt)")
    List<Diary> findFilteredDiaries(@Param("groupId") Long groupId, @Param("userId") Long memberId, @Param("createdAt") String date);
}