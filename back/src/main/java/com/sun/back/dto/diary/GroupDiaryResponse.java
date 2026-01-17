package com.sun.back.dto.diary;

import java.util.List;

public record GroupDiaryResponse(
        String groupTitle,
        String groupNotice,
        List<GetDiaryListResponse> diaries
) {}
