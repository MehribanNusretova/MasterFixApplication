package com.example.masterfix.service;

import com.example.masterfix.dto.request.UpdateUserRequest;
import com.example.masterfix.dto.response.UserResponse;
import com.example.masterfix.entity.User;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        return mapToUserResponse(user);
    }


    public UserResponse updateMyProfile(Authentication authentication, UpdateUserRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

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

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("İstifadəçi tapılmadı"));

        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}