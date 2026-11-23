package com.example.masterfix.config;

import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Value("${app.admin.phone:}")
    private String adminPhone;

    @Override
    public void run(String... args) {

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.warn("ADMIN_EMAIL or ADMIN_PASSWORD is not set, the default admin account was not created");
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .firstName("Admin")
                .lastName("MasterFix")
                .email(adminEmail)
                .userName("admin")
                .phone(adminPhone)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .active(true)
                .verified(true)
                .build();

        userRepository.save(admin);
        log.info("Default admin account was created");
    }
}
