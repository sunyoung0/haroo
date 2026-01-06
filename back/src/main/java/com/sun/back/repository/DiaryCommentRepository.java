package com.sun.back.repository;

import com.sun.back.entity.diary.DiaryComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Long> {

    @Query("SELECT c FROM DiaryComment c JOIN FETCH c.user WHERE c.diary.id = :diaryId ORDER BY c.createdAt ASC")
    List<DiaryComment> findAllByDiaryIdOrderByCreatedAtAsc(@Param("diaryId") Long diaryId);

    int countByDiaryId(Long diaryId);
}