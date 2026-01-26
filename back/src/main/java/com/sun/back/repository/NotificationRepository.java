package com.sun.back.repository;

import com.sun.back.dto.notification.NotificationResponse;
import com.sun.back.entity.diary.Notification;
import com.sun.back.enums.NotificationType;
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

    // 모든 알림 삭제할 때
    void deleteAllByUser_Email(String email);

    // 해당 댓글로 생성된 알림 삭제
    void deleteByTargetIdAndType(Long targetId, NotificationType type);
}
