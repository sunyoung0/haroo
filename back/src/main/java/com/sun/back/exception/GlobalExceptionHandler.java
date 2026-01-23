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

    // 공통 응답 생성 메서드
    private ResponseEntity<?> buildErrorResponse (HttpStatus status, String error, String message, WebRequest request) {
        // 현재 요청이 SSE(text/event-stream)를 원하는지 확인
        String acceptHeader = request.getHeader("Accept");
        if (acceptHeader != null && acceptHeader.contains("text/event-stream")) {
            // SSE 요청인 경우 객체(JSON) 대신 단순 문자열 혹은 에러 코드만 반환
            // 이렇게 하면 HttpMessageNotWritableException을 피할 수 있음
            return ResponseEntity.status(status).body("error : " + message);
        }

        // 일반적인 JSON 요청인 경우
        ErrorResponseRecord responseRecord = new ErrorResponseRecord(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(responseRecord, status);
    }

    // 회원가입 - 유효성 검사 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationException(MethodArgumentNotValidException exception, WebRequest request) {
        String errorMessage = exception.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Failed", errorMessage, request);
    }

    // 로그인 - 이메일 존재 X / 이메일 or 비밀번호 틀렸을 시 예외 처리
    @ExceptionHandler(LoginFailedException.class)
    public ResponseEntity<?> loginFailedException(LoginFailedException exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Login Failed", exception.getMessage(), request);
    }

    // 400 Bad Request - 비즈니스 로직 위반 (이미 가입됨, 방장 탈퇴 불가 등)
    @ExceptionHandler(DiaryGroupException.class)
    public ResponseEntity<?> diaryGroupException(DiaryGroupException exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Group Logic Error", exception.getMessage(), request);
    }

    // 403 Forbidden - 존재는 하지만 권한이 없는 경우 (본인의 글이 아니거나 멤버가 아닌 경우)
    @ExceptionHandler(DiaryAccessException.class)
    public ResponseEntity<?> diaryAccessException(DiaryAccessException exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Access Denied", exception.getMessage(), request);
    }

    // 404 Not Found - 다이어리/댓글/유저 등이 존재하지 않는 경우
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Resource Not Found", exception.getMessage(), request);
    }

    // 409 CONFLICT - 중복 예외 처리
    @ExceptionHandler(ExistsException.class)
    public ResponseEntity<?> existsException(ExistsException exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Already Exists", exception.getMessage(), request);
    }

    // 그 외 예상치 못한 모든 예외 처리 (서버 에러 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception exception, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "서버 내부 오류가 발생했습니다.", request);
    }
}