package com.example.masterfix.controller;

import com.example.masterfix.dto.request.UpdateUserRequest;
import com.example.masterfix.dto.response.UserResponse;
import com.example.masterfix.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.updateMyProfile(authentication, request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }


    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public void toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
    }
}