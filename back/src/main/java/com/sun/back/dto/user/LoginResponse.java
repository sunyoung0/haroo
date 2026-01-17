package com.sun.back.dto.user;

public record LoginResponse(
        String accessToken,
        String tokenType,
        String email,
        Long userId,
        String nickname) {
}
