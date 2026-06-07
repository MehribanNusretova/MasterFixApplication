package com.example.masterfix.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record ReviewRequest(

        @NotNull(message = "Booking ID boş ola bilməz")
        Long bookingId,

        @NotNull(message = "Rating boş ola bilməz")
        @Min(value = 1, message = "Rating minimum 1 olmalıdır")
        @Max(value = 5, message = "Rating maksimum 5 ola bilər")
        Integer rating,

        @Size(max = 1000, message = "Comment maksimum 1000 simvol ola bilər")
        String comment

) {
}