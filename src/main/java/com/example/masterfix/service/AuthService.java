package com.example.masterfix.service;

import com.example.masterfix.dto.request.LoginRequest;
import com.example.masterfix.dto.request.RegisterRequest;
import com.example.masterfix.dto.response.AuthResponse;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.UserRepository;
import com.example.masterfix.security.JwtService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
            throw new AlreadyExistsException("Bu email artiq istifade olunur");
        }
        if(userRepository.existsByUserName(request.userName())){
            throw new AlreadyExistsException("Bu username artiq istifade olunur");
        }
        if(userRepository.existsByPhone(request.phone())){
            throw new AlreadyExistsException("Bu phone artiq istifade olunur");
        }
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUserName(request.userName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole()
        );
    }
}
