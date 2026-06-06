package com.example.masterfix.service;

import com.example.masterfix.dto.request.UpdateUserRequest;
import com.example.masterfix.dto.response.UserResponse;
import com.example.masterfix.entity.User;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * UserService login olmuş istifadəçinin profil əməliyyatlarını idarə edir.
 * Məsələn: profilə baxmaq və profili yeniləmək.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        return mapToUserResponse(user);
    }


    public UserResponse updateMyProfile(Authentication authentication, UpdateUserRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }


    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}