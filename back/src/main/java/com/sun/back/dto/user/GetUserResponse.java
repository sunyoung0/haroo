package com.sun.back.dto.user;

import com.sun.back.entity.User;

public record GetUserResponse(
        Long id,
        String email,
        String nickname,
        String profileImage
){
    // static 이므로 객체를 생성하지 않고도 GetUserResponse.from(user)로 호출 가능
    public static GetUserResponse from(User user){
        return new GetUserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImage()
        );
    }
}
