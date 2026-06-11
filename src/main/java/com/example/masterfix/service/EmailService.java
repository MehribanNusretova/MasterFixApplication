package com.example.masterfix.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String firstName, String token) {

        String verificationLink = "http://localhost:8080/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MasterFix hesab təsdiqi");
        message.setText(
                "Salam " + firstName + ",\n\n" +
                "MasterFix hesabınızı təsdiqləmək üçün linkə daxil olun:\n" +
                verificationLink + "\n\n" +
                "Əgər bu qeydiyyatı siz etməmisinizsə, bu emaili görməzdən gəlin.\n\n" +
                "Hörmətlə,\nMasterFix Team"
        );

        mailSender.send(message);
    }
}