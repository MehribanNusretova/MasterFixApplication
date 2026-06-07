package com.example.masterfix.dto.response;

import com.example.masterfix.enums.BookingStatusEnum;

import java.time.LocalDateTime;

/**
 * Booking məlumatlarını frontendə qaytarmaq üçün response DTO.
 */
public record BookingResponse(
        Long id,
        String userFullName,
        String masterFullName,
        String masterCategory,
        String description,
        String address,
        LocalDateTime bookingDate,
        BookingStatusEnum bookingStatus
) {
}