package com.example.masterfix.service;

import com.example.masterfix.config.JwtConfig;
import com.example.masterfix.entity.RefreshToken;
import com.example.masterfix.entity.User;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final JwtConfig jwtConfig;


    public RefreshToken createRefreshToken(User user) {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);

        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken.setExpiryDate(
                LocalDateTime.now().plusNanos(
                        jwtConfig.getRefreshExpiration() * 1_000_000
                )
        );

        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AccessDeniedException("Refresh token tapılmadı"));

        if (refreshToken.isRevoked()) {
            throw new AccessDeniedException("Refresh token ləğv edilib");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AccessDeniedException("Refresh tokenin vaxtı bitib");
        }

        return refreshToken;
    }


    public void revokeRefreshToken(RefreshToken refreshToken) {

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }


    public void deleteByUser(User user) {

        refreshTokenRepository.deleteByUser(user);
    }
}