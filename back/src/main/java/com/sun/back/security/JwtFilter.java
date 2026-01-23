package com.sun.back.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 헤더에서 Authorization 값을 가져옴
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Bearer로 시작하는 토큰이 있는지 확인
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Bearer 제외한 토큰만 추출

            try {
                // 토큰 검증
                if(jwtService.validateToken(token)) {
                    String email = jwtService.getEmailFromToken(token);

                    // 인증 객체 생성
                    Authentication auth = new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

                    // 시큐리티 컨텍스트에 저장(컨트롤러가 로그인 한 유저를 알게 됨
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (ExpiredJwtException e) {
                sendErrorResponse(response, request, "토큰이 만료되었습니다. 다시 로그인 해주세요.");
                return;
            } catch (JwtException | IllegalArgumentException e) {
                sendErrorResponse(response, request, "유효하지 않은 토큰입니다.");
                return;
            }
        }
        // 다음 필터로 넘김
        filterChain.doFilter(request, response);
    }

    // 에러메시지 전달용 메서드
    private void sendErrorResponse(HttpServletResponse response, HttpServletRequest request, String message) throws IOException {
        //  응답 상태 코드 설정 (401 Unauthorized)
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 요청 헤더 확인
        String acceptHeader = request.getHeader("Accept");

        if (acceptHeader != null && acceptHeader.contains("text/event-stream")) {
            // SSE 요청일 경우 SSE 포맷에 맞게 응답
            response.setContentType("text/event-stream;charset=UTF-8");
            // SSE 에러 이벤트 포맷
            response.getWriter().write("event: error\ndata: " + message);
        } else {
            // 일반 요청일 경우 기존처럼 JSON으로 응답
            response.setContentType("application/json;charset=UTF-8");
            // 실제 보낼 JSON 내용
            String jsonResponse = String.format("{\"error\": \"Unauthorized\", \"message\": \"%s\"}", message);
            // 4. 클라이언트에게 전달
            response.getWriter().write(jsonResponse);
        }

        response.getWriter().flush();   // 확실하게 밀어내기

    }
}
