package com.sun.back.entity.diary;

import com.sun.back.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
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

    @Column( nullable = false, columnDefinition = "TEXT")
    private String content;

//    private String imageUrl;

    private String feelingType; // 감정

    private boolean isTemp = false; // 임시 저장 여부

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL)
    private List<DiaryLike> likes = new ArrayList<>();
}
