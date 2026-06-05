package com.example.masterfix.dto.response;

public record FavoriteResponse( Long id,
                                Long masterId,
                                String masterFullName,
                                String categoryName,
                                String city,
                                Double averageRating) {
}
