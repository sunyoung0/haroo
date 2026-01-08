package com.sun.back.entity.diary;

import com.sun.back.entity.BaseTimeEntity;
import com.sun.back.entity.User;
import com.sun.back.enums.FeelingType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary extends BaseTimeEntity {    // 일기

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

    private FeelingType feelingType; // 감정

    private boolean isTemp; // 임시 저장 여부

    @Column(length = 10)
    private String diaryDate;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryLike> likes = new ArrayList<>();

    // 임시 저장 해제
    public void publish() {
        this.isTemp = false;
    }

    @Builder
    public Diary(DiaryGroup diaryGroup, User user, String title, String content, FeelingType feelingType, boolean isTemp, String diaryDate) {
        this.diaryGroup = diaryGroup;
        this.user = user;
        this.title = title;
        this.content = content;
        this.diaryDate = diaryDate;
        this.feelingType = feelingType;
        this.isTemp = isTemp;
    }

    public void updateDiary(String title, String content, String diaryDate, FeelingType feelingType) {
        this.title = title;
        this.content = content;
        this.diaryDate = diaryDate;
        this.feelingType = feelingType;
    }
}