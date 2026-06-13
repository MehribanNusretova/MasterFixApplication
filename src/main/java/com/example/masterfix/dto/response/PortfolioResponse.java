package com.example.masterfix.dto.response;

import com.example.masterfix.enums.MediaType;
import java.time.LocalDateTime;

public record PortfolioResponse(
        Long id,
        String title,
        String description,
        String mediaUrl,
        MediaType mediaType,
        LocalDateTime createdAt
) {
}
