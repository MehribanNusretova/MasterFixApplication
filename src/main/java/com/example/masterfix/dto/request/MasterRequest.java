package com.example.masterfix.dto.request;

import jakarta.validation.constraints.*;

public record MasterRequest(
        @NotNull(message = "Kateqoriya boş ola bilməz")
        Long categoryId,

        @NotBlank(message = "Təsvir boş ola bilməz")
        @Size(max = 1000, message = "Təsvir maksimum 1000 simvol ola bilər")
        String description,

        @NotNull(message = "Təcrübə ili boş ola bilməz")
        @Min(value = 0, message = "Təcrübə ili mənfi ola bilməz")
        Integer experienceYear,

        @NotBlank(message = "Şəhər boş ola bilməz")
        String city,

        @NotBlank(message = "Ünvan boş ola bilməz")
        String address,

        @NotNull(message = "Minimum qiymət boş ola bilməz")
        @PositiveOrZero(message = "Minimum qiymət mənfi ola bilməz")
        Double priceFrom,

        @NotNull(message = "Maksimum qiymət boş ola bilməz")
        @Positive(message = "Maksimum qiymət sıfırdan böyük olmalıdır")
        Double priceTo,

        String profileImageUrl
) {}