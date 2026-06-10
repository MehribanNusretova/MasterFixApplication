package com.example.masterfix.dto.response;

import com.example.masterfix.enums.Role;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String email,
        Role role
) {
}