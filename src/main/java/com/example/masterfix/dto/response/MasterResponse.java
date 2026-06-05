package com.example.masterfix.dto.response;

public record MasterResponse (
    Long id,
    String fullName,
    String categoryName,
    String description,
    Integer experienceYear,
    String city,
    String address,
    Double priceFrom,
    Double priceTo,
    Boolean available,
    Double averageRating,
    Integer completedJobs

)
{

}
