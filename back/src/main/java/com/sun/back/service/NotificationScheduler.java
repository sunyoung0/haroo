package com.sun.back.service;

import com.sun.back.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationRepository notificationRepository;

    // 매일 새벽 3시에 실행(cron 표현식: 초 분 시 일 월 요일), 30일이 지난 '읽은 알림' 삭제
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void deleteOldNotifications() {
        // 현재 시간 기준 30일 전 계산
        LocalDateTime retentionalPeriod = LocalDateTime.now().minusDays(30);
        log.info("알림 청소 스케쥴러 가동 : 30일 지난 읽은 알림 삭제");

        notificationRepository.deleteByCreatedAtBeforeAndIsReadTrue(retentionalPeriod);
        log.info("알림 청소 완료");
    }

}
