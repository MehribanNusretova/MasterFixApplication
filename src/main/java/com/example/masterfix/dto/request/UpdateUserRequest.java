package com.example.masterfix.dto.request;


public record UpdateUserRequest(
        String firstName,
        String lastName,
        String phone
) {
}