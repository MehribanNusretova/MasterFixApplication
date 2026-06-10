package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Kateqoriya adı boş ola bilməz")
        @Size(min = 2, max = 50, message = "Kateqoriya adı 2 ilə 50 simvol arasında olmalıdır")
        String name,

        @NotBlank(message = "Kateqoriya təsviri boş ola bilməz")
        String description
) {
}