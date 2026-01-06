package com.sun.back.entity.diary;

import com.sun.back.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "diary_like",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_diary_user",
                        columnNames = {"diary_id", "user_id"} // 일기ID와 유저ID의 조합은 유일해야 함
                )
        }
)
public class DiaryLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();

    public DiaryLike(Diary diary, User user) {
        this.diary = diary;
        this.user = user;
    }
}
