package com.sun.back.service;

import com.sun.back.dto.notification.NotificationResponse;
import com.sun.back.entity.User;
import com.sun.back.entity.diary.Notification;
import com.sun.back.enums.NotificationType;
import com.sun.back.exception.ResourceNotFoundException;
import com.sun.back.repository.EmitterRepository;
import com.sun.back.repository.NotificationRepository;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserRepository userRepository;
    private final EmitterRepository emitterRepository;
    private final NotificationRepository notificationRepository;

    // 1. SSE 연결 설정
    public SseEmitter subscribe(String email) {
        // SseEmitter 생성 및 저장
        SseEmitter emitter = new SseEmitter(60L * 1000 * 60);   // 만료시간 1시간

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        emitterRepository.save(user.getId(), emitter);

        // 연결 만료 및 에러 발생 시 삭제 처리
        emitter.onCompletion(() -> emitterRepository.deleteById(user.getId()));
        emitter.onTimeout(() -> emitterRepository.deleteById(user.getId()));

        // 구독 직후 DB에서 읽지 않은 알림들을 조회해서 전송
        List<Notification> unreadNotifications = notificationRepository.findAllByUser_IdAndIsReadFalse(user.getId());

        for (Notification notification : unreadNotifications) {
            // 기존에 만든 DTO 변환 로직 활용
            NotificationResponse response = new NotificationResponse(
                    notification.getId(),
                    notification.getMessage(),
                    notification.getType(),
                    notification.getSender(),
                    notification.getUrl()
            );

            // 해당 유저의 emitter로 데이터 전송
            sendToClient(user.getId(), response);
        }

        // 503 에러 방지를 위한 첫 더미 데이터 전송
        sendToClient(user.getId(), "Connected! userId = " + user.getId());

        return emitter;
    }

    // 2 알림 전송 (댓글/좋아요 로직에서 호출)
    @Transactional
    public void send(User user, NotificationType type, String sender, String message, String url) {
        // DB 저장
        Notification notification = notificationRepository.save(
                Notification.builder()
                        .user(user)
                        .type(type)
                        .sender(sender)
                        .message(message)
                        .url(url)
                        .build()
        );

        // 실시간 전송
        NotificationResponse response = new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.getType(),
                notification.getSender(),
                notification.getUrl()
        );

        sendToClient(user.getId(), response);
    }

    // 503 에러 방지를 위한 첫 더미 데이터 전송 메서드
    private void sendToClient (Long userId, Object data) {
        SseEmitter emitter = emitterRepository.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .id(String.valueOf(userId))
                        .name("Notification") // 프론트에서 받을 이벤트 이름
                        .data(data));
            } catch (IOException e) {
                emitterRepository.deleteById(userId);
            }
        }
    }

    // 알람 조회
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        return notificationRepository.findAllByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(n -> new NotificationResponse(n.id(), n.message(), n.type(), n.sender(), n.url()))
                .toList();
    }

    // 알람 읽음
    @Transactional
    public void readNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("알람이 존재하지 않습니다."));
        notification.markAsRead();  // 상태 변경
    }
}
