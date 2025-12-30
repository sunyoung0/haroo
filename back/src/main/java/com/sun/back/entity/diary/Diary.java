package com.sun.back.entity.diary;

import com.sun.back.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary {    // 일기

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private DiaryGroup diaryGroup; // 어떤 다이어리 앱(그룹)에 쓴 글인지

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 작성자

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")    // 제한 없이 긴 텍스트를 저장할 수 있도록 DB에 TEXT 타입으로 명시
    private String content;

//    private String imageUrl;

    private String feelingType; // 감정

    private boolean isTemp; // 임시 저장 여부

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryLike> likes = new ArrayList<>();

    @Builder
    public Diary(DiaryGroup diaryGroup, User user, String title, String content, String feelingType, boolean isTemp, LocalDateTime createdAt) {
        this.diaryGroup = diaryGroup;
        this.user = user;
        this.title = title;
        this.content = content;
        this.feelingType = feelingType;
        this.isTemp = false;
        this.createdAt = LocalDateTime.now();
    }

    public void updateDiary(String title, String content, String feelingType, boolean isTemp) {
        this.title = title;
        this.content = content;
        this.feelingType = feelingType;
        this.isTemp = isTemp;
    }

    public void publish() {
        this.isTemp = false;
    }
}
