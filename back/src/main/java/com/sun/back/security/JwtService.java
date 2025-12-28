package com.sun.back.security;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {
    // 24시간
    static final long EXPIRATIONTIME = 86400000;

    private static final SecretKey SIGNINGKEY = Jwts.SIG.HS256.key().build();

    public String getToken(String email, Long userId) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(SIGNINGKEY)
                .compact();
    }

    public boolean validateToken(String token) {
            Jwts.parser().verifyWith(SIGNINGKEY).build().parseSignedClaims(token);
            return true;
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(SIGNINGKEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}
