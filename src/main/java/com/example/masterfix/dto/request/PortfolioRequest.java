package com.example.masterfix.dto.request;

import com.example.masterfix.enums.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PortfolioRequest(
        @NotBlank(message = "Başlıq boş ola bilməz")
        String title,
        
        String description,
        
        @NotNull(message = "Media növü seçilməlidir")
        MediaType mediaType
) {
}
