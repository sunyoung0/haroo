package com.sun.back.dto.notification;

import com.sun.back.enums.NotificationType;

public record NotificationResponse(
        Long id,
        String message,
        NotificationType type,
        String sender,
        String url
){}
