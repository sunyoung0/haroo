package com.sun.back.controller;

import com.sun.back.dto.user.*;
import com.sun.back.entity.User;
import com.sun.back.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signUp")
    public ResponseEntity<User> signUp(@Valid @RequestBody SignUpRequest dto) {
        return userService.signUp(dto);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest dto) {
        LoginResponse response = userService.login(dto);
        return ResponseEntity.ok(response);
    }

    // 회원 정보 조회
    @GetMapping("/user")
    public ResponseEntity<GetUserResponse> getUser(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getUser(email));
    }

    // 닉네임 수정
    @PatchMapping("/nickname")
    public ResponseEntity<String> updateNickname(@AuthenticationPrincipal String email, @RequestBody NicknameRequest dto) {
        userService.updateNickname(email, dto.nickname());
        return ResponseEntity.ok("닉네임이 성공적으로 수정되었습니다.");
    }

    // TODO : 토큰 테스트용 나중에 지우기
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("토큰 인증 성공");
    }

}
