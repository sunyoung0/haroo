package com.sun.back.repository;

import com.sun.back.entity.User;
import com.sun.back.entity.diary.DiaryMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DiaryMemberRepository  extends JpaRepository<DiaryMember, Long> {
    // 특정 유저가 속한 모든 멤버 관계 정보를 가져옴 (그룹 정보까지)
    @Query("SELECT m FROM DiaryMember m JOIN FETCH m.diaryGroup WHERE m.user = :user")
    List<DiaryMember> findAllByUserWithGroup(User user);

    boolean existsByUserAndDiaryGroup_Id(User user, Long groupId);

    Optional<DiaryMember> findByUser_EmailAndDiaryGroup_Id(String email, Long groupId);

    List<DiaryMember> findAllByDiaryGroup_Id(Long groupId);

    boolean existsByUser_EmailAndDiaryGroup_Id(String email, Long id);

    Integer countByDiaryGroup_Id(Long groupId);
}