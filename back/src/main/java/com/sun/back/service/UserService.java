package com.sun.back.service;

import com.sun.back.dto.user.SignUpRequest;
import com.sun.back.exception.EmailExistsException;
import com.sun.back.exception.NicknameExistsException;
import com.sun.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.sun.back.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원 가입
    public ResponseEntity<User> signUp(SignUpRequest dto) {

        // 이메일 닉네임 중복 체크
        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailExistsException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByNickname(dto.nickname())) {
            throw new NicknameExistsException("이미 존재하는 닉네임입니다.");
        }

        User user = User.builder()
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .nickname(dto.nickname())
                .build();
        return ResponseEntity.ok(userRepository.save(user));
    }
}
