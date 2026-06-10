package com.example.masterfix.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BookingRequest(
        @NotNull(message = "Usta ID-si boş ola bilməz")
        Long masterId,

        @NotBlank(message = "Sifariş təsviri boş ola bilməz")
        String description,

        @NotBlank(message = "Ünvan boş ola bilməz")
        String address,

        @NotNull(message = "Sifariş tarixi boş ola bilməz")
        @FutureOrPresent(message = "Sifariş tarixi keçmiş zaman ola bilməz")
        LocalDateTime bookingDate
) {
}