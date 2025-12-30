package com.sun.back.dto.diary;

import com.sun.back.entity.enums.GroupType;

public record GroupCreateRequest(String title, String notice, GroupType type) {}
