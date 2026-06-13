package com.example.masterfix.controller;

import com.example.masterfix.dto.request.LoginRequest;
import com.example.masterfix.dto.request.RefreshTokenRequest;
import com.example.masterfix.dto.request.RegisterRequest;
import com.example.masterfix.dto.request.ForgotPasswordRequest;
import com.example.masterfix.dto.request.ResetPasswordRequest;
import com.example.masterfix.dto.response.AuthResponse;
import com.example.masterfix.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        return authService.refreshToken(request);
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam String token) {
        return authService.verifyAccount(token);
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
    }
}