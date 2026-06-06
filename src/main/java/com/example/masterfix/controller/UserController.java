package com.example.masterfix.controller;

import com.example.masterfix.dto.request.UpdateUserRequest;
import com.example.masterfix.dto.response.UserResponse;
import com.example.masterfix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * UserController login olmuş istifadəçi ilə bağlı endpointləri saxlayır.
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/me")
    public UserResponse getMyProfile(Authentication authentication) {
        return userService.getMyProfile(authentication);
    }

    @PutMapping("/me")
    public UserResponse updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateUserRequest request
    ) {
        return userService.updateMyProfile(authentication, request);
    }
}