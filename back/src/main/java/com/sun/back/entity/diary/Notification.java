package com.sun.back.entity.diary;

import com.sun.back.entity.BaseTimeEntity;
import com.sun.back.entity.User;
import com.sun.back.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User user;  // 알림을 받을 사람 (일기 작성자)

    private String sender;  // 알림을 보낸 사람 (댓글 혹은 좋아요를 단 사람)

    @Enumerated(EnumType.STRING)
    private NotificationType type;  // 어떤 알림인지

    private String message;

    private String url;  // 클릭 시 이동할 링크

    private Long targetId;  // 알림 대상의 ID ( 댓글 / 좋아요)

    private boolean isRead;     // 읽음 처리 여부

    @Builder
    public Notification (User user, NotificationType type, String sender, String message, String url, Long targetId) {
        this.user = user;
        this.type = type;
        this.sender = sender;
        this.message = message;
        this.url = url;
        this.targetId = targetId;
    }

    public void markAsRead() {
        this.isRead = true;
    }

}