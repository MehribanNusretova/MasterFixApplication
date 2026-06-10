package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank(message = "Ad boş ola bilməz")
        String firstName,

        @NotBlank(message = "Soyad boş ola bilməz")
        String lastName,

        @NotBlank(message = "Telefon nömrəsi boş ola bilməz")
        String phone
) {
}