package com.sun.back.dto.error;

import java.time.LocalDateTime;

public record ErrorResponseRecord(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path
){}