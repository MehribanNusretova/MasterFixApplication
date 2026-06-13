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

        if (!userRepository.existsByEmail("admin@masterfix.com")) {

            User admin = new User();

            admin.setFirstName("Admin");
            admin.setLastName("Admin");
            admin.setUserName("admin");

            admin.setEmail("admin@masterfix.az");

            admin.setPhone("+994500000000");

            admin.setPassword(
                    passwordEncoder.encode("admin123")
            );

            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

        }
    }
}