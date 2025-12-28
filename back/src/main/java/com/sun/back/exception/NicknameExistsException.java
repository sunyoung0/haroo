package com.sun.back.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class NicknameExistsException extends RuntimeException {
    public NicknameExistsException(String message) {
        super(message);
    }
}
