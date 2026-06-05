package com.example.masterfix.dto.request;

public record MasterRequest(     Long categoryId,
                                 String description,
                                 Integer experienceYear,
                                 String city,
                                 String address,
                                 Double priceFrom,
                                 Double priceTo,
                                 String profileImageUrl) {
}
