package com.example.masterfix.dto.response;

import com.example.masterfix.enums.Role;

public record UserResponse
    ( Long id,
    String firstName,
    String lastName,
    String username,
    String email,
    String phone,
    Role role)
{}
