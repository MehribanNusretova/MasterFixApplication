package com.example.masterfix.dto.response;

public record CategoryResponse
    (Long id,
    String name,
    String description,
    Boolean isActive)
{}
