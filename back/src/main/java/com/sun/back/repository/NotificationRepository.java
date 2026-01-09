package com.sun.back.repository;

import com.sun.back.entity.diary.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
