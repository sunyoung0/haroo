package com.sun.back.controller;

import com.sun.back.dto.notification.NotificationResponse;
import com.sun.back.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 클라이언트가 SSE 구독을 위해 호출하는 GET API
    // Produces = "text/event-stream" 설정이 필수
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal String email) {
        return notificationService.subscribe(email);
    }

    // 알림 조회
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotification (@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(notificationService.getNotifications(email));
    }

    // 알림을 클릭했을 때 isReade(읽음상태) true로 변환
    @PatchMapping("/notifications/read/{notificationId}")
    public ResponseEntity<Void> readNotification(@PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    // 알람 삭제
    @DeleteMapping("/notification/delete/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@AuthenticationPrincipal String email, @PathVariable Long notificationId) {
        notificationService.deleteNotification(email, notificationId);
        return ResponseEntity.ok().build();
    }

    // 알림 전체 삭제
    @DeleteMapping("/notification/delete/all")
    public ResponseEntity<Void> deleteAllNotification(@AuthenticationPrincipal String email) {
        notificationService.deleteAllNotifications(email);
        return ResponseEntity.ok().build();
    }

}
