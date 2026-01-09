package com.sun.back.dto.notification;

public record NotificationResponse(
        Long id,
        String content,
        String type,
        String sender,
        String url
){}
