package com.sun.back.repository;

import com.sun.back.dto.notification.NotificationResponse;
import com.sun.back.entity.diary.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // 사용자의 알림 조회
    List<NotificationResponse> findAllByUser_IdOrderByCreatedAtDesc(Long id);

    // 읽지 않은 알림 목록 조회
    List<Notification> findAllByUser_IdAndIsReadFalse(Long id);

    // 특정 날짜 이전에 생성된 알림 중, 이미 읽은 알림만 삭제
    void deleteByCreatedAtBeforeAndIsReadTrue(LocalDateTime date);

    // (선택) 읽었든 안 읽었든 90일 이상 된 아주 오래된 알림은 무조건 삭제하고 싶을 때
    void deleteByCreatedAtBefore(LocalDateTime date);
}
