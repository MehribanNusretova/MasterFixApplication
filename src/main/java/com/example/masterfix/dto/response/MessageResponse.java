package com.example.masterfix.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        Long bookingId,
        Long senderId,
        String senderName,
        String content,
        LocalDateTime createdAt,
        boolean read
) {
}
