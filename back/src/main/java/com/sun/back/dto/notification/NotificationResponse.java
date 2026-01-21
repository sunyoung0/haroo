package com.sun.back.dto.notification;

import com.sun.back.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String message,
        NotificationType type,
        String sender,
        String url,
        LocalDateTime createdAt,
        boolean isRead
){}
