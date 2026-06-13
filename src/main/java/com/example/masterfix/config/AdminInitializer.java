package com.example.masterfix.config;

import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail("admin@masterfix.az")) {
            return;
        }

        User admin = User.builder()
                .firstName("Admin")
                .lastName("MasterFix")
                .email("admin@masterfix.az")
                .userName("admin")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .verified(true)
                .build();

        userRepository.save(admin);
    }
}


