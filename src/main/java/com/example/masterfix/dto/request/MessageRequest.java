package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageRequest(
        @NotBlank(message = "Mesaj boş ola bilməz")
        @Size(max = 1000, message = "Mesaj çox uzundur")
        String content
) {
}
