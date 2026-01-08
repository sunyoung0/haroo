package com.sun.back.entity.diary;

import com.sun.back.entity.BaseTimeEntity;
import com.sun.back.entity.User;
import jakarta.persistence.*;

@Entity
public class Notification extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    private User receiver;  // 알림을 받을 사람 (일기 작성자)

    private String message;
    private String relatedUrl;  // 클릭 시 이동할 링크
    private boolean isRead;     // 읽음 처리 여부
}