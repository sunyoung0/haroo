package com.sun.back.dto.diaryGroup;

import com.sun.back.entity.enums.GroupType;

public record GroupCreateRequest(String title, String notice, GroupType type) {}
