package com.example.masterfix.dto.request;

public record RegisterRequest (
        String firstName,
        String lastName,
        String userName,
        String email,
        String password,
        String phone
)
{ }
