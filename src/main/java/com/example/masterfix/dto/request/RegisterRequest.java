package com.example.masterfix.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
        @NotBlank(message = "Ad boş ola bilməz")
        String firstName,

        @NotBlank(message = "Soyad boş ola bilməz")
        String lastName,

        @NotBlank(message = "İstifadəçi adı boş ola bilməz")
        String userName,

        @NotBlank(message = "Email boş ola bilməz")
        @Email(message = "Düzgün email formatı daxil edin")
        String email,

        @NotBlank(message = "Şifrə boş ola bilməz")
        @Size(min = 6, message = "Şifrə ən azı 6 simvoldan ibarət olmalıdır")
        String password,

        @NotBlank(message = "Telefon nömrəsi boş ola bilməz")
        String phone
)
{ }