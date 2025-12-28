package com.sun.back.exception;

import com.sun.back.dto.error.ErrorResponseRecord;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice   // 모든 컨트롤러에서 발생하는 예외를 여기서 가로챔
public class GlobalExceptionHandler {

    // 회원가입 - 유효성 검사 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseRecord> validationException(MethodArgumentNotValidException exception, WebRequest request) {
        String errorMessage = exception.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        ErrorResponseRecord errorResponseRecord = new ErrorResponseRecord(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                errorMessage,
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponseRecord, HttpStatus.BAD_REQUEST);
    }

    // 회원가입 - 이메일 중복 예외 처리
    @ExceptionHandler(EmailExistsException.class)
    public ResponseEntity<ErrorResponseRecord> emailExistsException(EmailExistsException exception, WebRequest request) {
        ErrorResponseRecord errorResponseRecord = new ErrorResponseRecord(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Email Already Exists",
                exception.getMessage(),
                request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(errorResponseRecord, HttpStatus.CONFLICT);
    }

    // 회원가입 - 닉네임 중복 예외 처리
    @ExceptionHandler(NicknameExistsException.class)
    public ResponseEntity<ErrorResponseRecord> nicknameExistsException(NicknameExistsException exception, WebRequest request) {
        ErrorResponseRecord errorResponseRecord = new ErrorResponseRecord(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Nickname Already Exists",
                exception.getMessage(),
                request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(errorResponseRecord, HttpStatus.CONFLICT);
    }





    // 그 외 예상치 못한 모든 예외 처리 (서버 에러 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseRecord> handleGlobalException(Exception exception, WebRequest request) {
        ErrorResponseRecord response = new ErrorResponseRecord(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "서버 내부 오류가 발생했습니다.",
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
