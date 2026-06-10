package com.example.masterfix.dto.response;

import com.example.masterfix.enums.Role;

public record AuthResponse

   (  String token,
      String email,
      Role role)
{}
