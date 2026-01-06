package com.sun.back.repository;

import com.sun.back.entity.diary.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    @Query("SELECT d FROM Diary d JOIN FETCH d.user WHERE d.diaryGroup.id = :groupId ORDER BY d.createdAt DESC")
    List<Diary> findAllByGroupIdWithUser(@Param("groupId") Long groupId);

    // 1. 일기 리스트 조회용 (전체 객체 반환)
    @Query("SELECT d FROM Diary d WHERE d.diaryGroup.id = :groupId " +
            "AND (:userId IS NULL OR d.user.id = :userId) " +
            "AND (:diaryDate IS NULL OR d.diaryDate LIKE CONCAT(:diaryDate, '%')) " +
            "ORDER BY d.diaryDate DESC, d.createdAt DESC")
    List<Diary> findFilteredDiaries(@Param("groupId") Long groupId, @Param("userId") Long memberId, @Param("diaryDate") LocalDate diaryDate);

    // 2. 캘린더 점 찍기용 (날짜만 반환, DISTINCT로 중복 제거), 특정 그룹의 특정 월(Year-Month)에 일기가 있는 날짜들만 조회
    @Query("SELECT DISTINCT d.diaryDate FROM Diary d WHERE d.diaryGroup.id = :groupId " +
            "AND (:diaryDate IS NULL OR d.diaryDate LIKE CONCAT(:diaryDate, '%'))")
    List<String> findByEntryDatesByMonth(@Param("groupId") Long groupId, @Param("diaryDate") String diaryDate);
}