package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token boş ola bilməz")
        String token,

        @NotBlank(message = "Yeni şifrə boş ola bilməz")
        @Size(min = 6, message = "Şifrə ən azı 6 simvoldan ibarət olmalıdır")
        String newPassword
) {
}
