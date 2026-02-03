package com.sun.back.controller;

import com.sun.back.dto.user.*;
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
    @PostMapping("/auth/register")
    public ResponseEntity<Void> signUp(@Valid @RequestBody SignUpRequest dto) {
        userService.signUp(dto);
        return ResponseEntity.ok().build();
    }

    // 로그인
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest dto) {
        LoginResponse response = userService.login(dto);
        return ResponseEntity.ok(response);
    }

    // 회원 정보 조회
    @GetMapping("/users/me")
    public ResponseEntity<GetUserResponse> getUser(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getUser(email));
    }

    // 닉네임 수정
    @PatchMapping("/users/me")
    public ResponseEntity<String> updateNickname(@AuthenticationPrincipal String email, @RequestBody NicknameRequest dto) {
        userService.updateNickname(email, dto.nickname());
        return ResponseEntity.ok("닉네임이 성공적으로 수정되었습니다.");
    }
}
