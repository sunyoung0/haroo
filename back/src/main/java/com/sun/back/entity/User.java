package com.sun.back.entity;

import com.sun.back.entity.diary.DiaryMember;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // 무분별한 생성자 생성 막기 위함
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

    private String profileImage;
    
    // 한명의 유저는 여러개의 다이어리 멤버(오너)가 될 수 있음
    @OneToMany(mappedBy = "user")
    private List<DiaryMember> diaryMembers = new ArrayList<>();

    // 회원 가입 시 필요한 필드만 포함한 생성자
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