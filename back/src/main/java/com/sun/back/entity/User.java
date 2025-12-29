package com.sun.back.entity;

import com.sun.back.entity.diary.DiaryMember;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @OneToMany(mappedBy = "user")
    private List<DiaryMember> diaryMembers = new ArrayList<>();

    @Builder
    public User(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    // 닉네임 수정용 메서드
    public void updateNickname(String newNickname) {
        if(newNickname == null || newNickname.isBlank()) {
            throw new IllegalArgumentException("닉네임은 빈값일 수 없습니다.");
        }
        this.nickname = newNickname;
    }
}