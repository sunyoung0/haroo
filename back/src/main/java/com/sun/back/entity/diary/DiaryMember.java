package com.sun.back.entity.diary;

import com.sun.back.entity.BaseTimeEntity;
import com.sun.back.entity.User;
import com.sun.back.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryMember extends BaseTimeEntity {  // 다이어리 멤버

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

    @Builder
    public DiaryMember(DiaryGroup diaryGroup, User user, MemberRole role) {
        this.diaryGroup = diaryGroup;
        this.user = user;
        this.role = role;
    }
}
