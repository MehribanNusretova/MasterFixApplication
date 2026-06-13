package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token boş ola bilməz")
        String token,

        @NotBlank(message = "Yeni şifrə boş ola bilməz")
        @Size(min = 8, message = "Şifrə minimum 8 simvol olmalıdır")
        String newPassword
) {
}
