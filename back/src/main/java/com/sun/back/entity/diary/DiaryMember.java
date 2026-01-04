package com.sun.back.entity.diary;

import com.sun.back.entity.User;
import com.sun.back.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryMember {  // 다이어리 멤버

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private DiaryGroup diaryGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private MemberRole role;

    private LocalDateTime joinedAt;

    @Builder
    public DiaryMember(DiaryGroup diaryGroup, User user, MemberRole role, LocalDateTime joinedAt) {
        this.diaryGroup = diaryGroup;
        this.user = user;
        this.role = role;
        this.joinedAt = LocalDateTime.now();
    }
}
