package com.example.masterfix.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(Long id,
                             String userFullName,
                             String masterFullName,
                             Integer rating,
                             String comment,
                             LocalDateTime createdAt) {
}
