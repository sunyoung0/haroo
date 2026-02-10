package com.sun.back.service;

import com.sun.back.dto.user.*;
import com.sun.back.exception.*;
import com.sun.back.repository.UserRepository;
import com.sun.back.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.sun.back.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 회원 가입
    public void signUp(SignUpRequest dto) {

        // 이메일 닉네임 중복 체크
        if (userRepository.existsByEmail(dto.email())) {
            throw new ExistsException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByNickname(dto.nickname())) {
            throw new ExistsException("이미 존재하는 닉네임입니다.");
        }

        User user = User.builder()
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .nickname(dto.nickname())
                .build();

        userRepository.save(user);
    }

    // 로그인
    @Transactional(readOnly = true)
    public LoginResponse login(@Valid LoginRequest dto) {

        // 이메일로 유저 존재 확인
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new LoginFailedException("이메일이 존재하지 않습니다."));

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new LoginFailedException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        // jwt 토큰 생성
        String accessToken = jwtService.getToken(user.getEmail(), user.getId());

        // 응답 DTO 생성 및 반환
        return new LoginResponse(accessToken, "Bearer", user.getEmail(), user.getId(), user.getNickname());
    }

    // 유저 정보 조회
    @Transactional(readOnly = true)
    public GetUserResponse getUser(String email) {
        // 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        return GetUserResponse.from(user);
    }

    // 닉네임 수정
    @Transactional
    public void updateNickname(String email, String newNickname) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 닉네임 중복 체크
        if(userRepository.existsByNickname(newNickname)) {
            throw new ExistsException("이미 사용 중인 닉네임입니다.");
        }

        user.updateNickname(newNickname);
    }

    // 프로필 이미지 등록
    @Transactional
    public String updateProfileImage(String email, String profileImage) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        user.updateProfileImage(profileImage);
        return user.getProfileImage();
    }
}
