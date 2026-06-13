package com.example.masterfix.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "Email boş ola bilməz")
        @Email(message = "Düzgün email formatı daxil edin")
        String email
) {
}
