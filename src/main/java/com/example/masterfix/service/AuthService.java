package com.example.masterfix.service;

import com.example.masterfix.dto.request.RegisterRequest;
import com.example.masterfix.dto.response.AuthResponse;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.email())){
            throw new RuntimeException("Bu email artiq istifade olunur");
        }
        if(userRepository.existsByUserName(request.userName())){
            throw new RuntimeException("Bu username artiq istifade olunur");
        }
        if(userRepository.existsByPhone(request.phone())){
            throw new RuntimeException("Bu phone artiq istifade olunur");
        }
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUserName(request.userName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
    }
}
