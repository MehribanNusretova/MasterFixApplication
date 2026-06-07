package com.example.masterfix.dto.request;

import java.time.LocalDateTime;


public record BookingRequest(
        Long masterId,
        String description,
        String address,
        LocalDateTime bookingDate
) {
}