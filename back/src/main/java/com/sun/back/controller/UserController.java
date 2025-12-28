package com.sun.back.controller;

import com.sun.back.dto.user.SignUpRequest;
import com.sun.back.entity.User;
import com.sun.back.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signUp")
    public ResponseEntity<User> signUp(@Valid @RequestBody SignUpRequest dto) {
        return userService.signUp(dto);
    }

}
