package com.sun.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass // JPA Entity 들이 이 클래스를 상속받을 경우 필드들도 컬럼으로 인식하게 함
@EntityListeners(AuditingEntityListener.class) // 엔티티의 변화를 감지하여 시간을 자동 기록
public abstract class BaseTimeEntity {

    @CreatedDate    // 생성 시 자동 저장
    @Column(updatable = false)  // 생성 후에는 수정 불가하게 막음
    private LocalDateTime createdAt;

    @LastModifiedDate   // 수정 시 자동 갱신
    private LocalDateTime updatedAt;
}
