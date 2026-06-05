package com.example.masterfix.dto.response;

import com.example.masterfix.enums.Role;

public record AuthResponse
    //"firstName":"Elşən",
    //  "lastName":"Hətəmov",
    //  "userName":"elsen123",
    //  "email":"test@gmail.com",
    //  "password":"123456",
    //  "phone":"0501234567"
   (  String accessToken,
      String email,
      Role role)
{}
