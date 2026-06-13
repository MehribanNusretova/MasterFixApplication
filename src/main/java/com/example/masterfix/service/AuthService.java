package com.example.masterfix.service;

import com.example.masterfix.dto.request.LoginRequest;
import com.example.masterfix.dto.request.RefreshTokenRequest;
import com.example.masterfix.dto.request.RegisterRequest;
import com.example.masterfix.dto.request.ResetPasswordRequest;
import com.example.masterfix.dto.response.AuthResponse;
import com.example.masterfix.entity.PasswordResetToken;
import com.example.masterfix.entity.RefreshToken;
import com.example.masterfix.entity.User;
import com.example.masterfix.entity.VerificationToken;
import com.example.masterfix.enums.Role;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.PasswordResetTokenRepository;
import com.example.masterfix.repository.UserRepository;
import com.example.masterfix.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    AuthenticationManager authenticationManager;
    RefreshTokenService refreshTokenService;
    EmailService emailService;
    VerificationService verificationService;
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
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
        VerificationToken verificationToken =
                verificationService.createVerificationToken(savedUser);

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getFirstName(),
                verificationToken.getToken()
        );


        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = refreshTokenService.createRefreshToken(savedUser).getToken();

        return new AuthResponse(
                accessToken,
                refreshToken,
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

        if (!user.isVerified()) {
            throw new AccessDeniedException("Zəhmət olmasa əvvəl email ünvanınızı təsdiqləyin");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole()
        );
    }
    public String verifyAccount(String token) {
        return verificationService.verifyAccount(token);
    }
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken oldRefreshToken =
                refreshTokenService.verifyRefreshToken(request.refreshToken());

        User user = oldRefreshToken.getUser();

        refreshTokenService.revokeRefreshToken(oldRefreshToken);

        String newAccessToken = jwtService.generateToken(user);

        String newRefreshToken =
                refreshTokenService.createRefreshToken(user).getToken();

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Bu email ünvanı ilə istifadəçi tapılmadı"));

        // Köhnə tokenləri təmizlə
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new ResourceNotFoundException("Yanlış və ya keçərsiz token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new AccessDeniedException("Tokenin vaxtı bitib, zəhmət olmasa yenidən cəhd edin");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}
