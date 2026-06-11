package com.example.masterfix.service;

import com.example.masterfix.entity.User;
import com.example.masterfix.entity.VerificationToken;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.repository.UserRepository;
import com.example.masterfix.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;

    public VerificationToken createVerificationToken(User user) {

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setUser(user);
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));

        return verificationTokenRepository.save(verificationToken);
    }

    public String verifyAccount(String token) {

        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new AccessDeniedException("Verification token tapılmadı"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AccessDeniedException("Verification tokenin vaxtı bitib");
        }

        User user = verificationToken.getUser();
        user.setVerified(true);
        user.setActive(true);

        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);

        return "Hesab uğurla təsdiqləndi";
    }
}