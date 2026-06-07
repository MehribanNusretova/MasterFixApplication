package com.example.masterfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(

        @NotNull
        Long masterId,

        @NotBlank
        String description,

        @NotBlank
        String address

) {
}
