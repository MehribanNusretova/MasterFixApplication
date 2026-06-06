package com.example.masterfix.security;

import com.example.masterfix.config.JwtConfig;
import com.example.masterfix.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts; // JWT yaratmaq və oxumaq üçün əsas class

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtConfig jwtConfig;
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role",user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+jwtConfig.getExpiration()))
                .signWith(getSignInKey())
                .compact();
    }
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }
    public boolean isTokenValid(String token,User user) {
        String email = extractEmail(token);
        return email.equals(user.getEmail())&&!isTokenExpired(token);
    }
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private SecretKey getSignInKey() {
        byte[] keyBytes = jwtConfig.getSecretKey().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
