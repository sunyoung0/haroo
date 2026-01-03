package com.sun.back.entity.diary;

import com.sun.back.entity.User;
import com.sun.back.entity.enums.GroupType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryGroup {   // 다이어리 종류(개인인지 공유인지)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private GroupType type;

    private String notice;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)  // 작성자의 정보를 바로 가져올 필요가 없다면 조회하지 않고 미뤄둠
    @JoinColumn(name = "created_by")
    private User user;

    // 일기(Diary)와의 연관관계에 아래 옵션을 추가하세요.
    @OneToMany(mappedBy = "diaryGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Diary> diaries = new ArrayList<>();

    @OneToMany(mappedBy = "diaryGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryMember> members = new ArrayList<>();

    @Builder
    public DiaryGroup(String title, GroupType type, String notice, User user, LocalDateTime createdAt) {
        this.title = title;
        this.type = type;
        this.notice = notice;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // 공지 수정
    public void updateNotice(String notice) {
        this.notice = notice;
    }
}


