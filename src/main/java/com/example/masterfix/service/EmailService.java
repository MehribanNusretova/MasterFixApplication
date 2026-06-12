package com.example.masterfix.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingNotification(String toEmail, String masterName, String customerName, String customerPhone, String category, String address, String date, String description) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Yeni sifariş aldınız - MasterFix");
        message.setText(
                "Salam " + masterName + ",\n\n" +
                "Sizə yeni sifariş gəldi.\n\n" +
                "Sifariş məlumatları:\n" +
                "- Müştəri adı: " + customerName + "\n" +
                "- Müştəri telefonu: " + customerPhone + "\n" +
                "- Xidmət kateqoriyası: " + category + "\n" +
                "- Ünvan: " + address + "\n" +
                "- Tarix: " + date + "\n" +
                "- Qısa təsvir: " + description + "\n\n" +
                "Hörmətlə,\nMasterFix Team"
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email göndərilərkən xəta baş verdi: " + e.getMessage());
        }
    }
    public void sendVerificationEmail(
            String to,
            String firstName,
            String verificationLink
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "MasterFix Hesab Təsdiqi"
        );

        message.setText(
                "Salam " + firstName + ",\n\n" +
                        "Hesabınızı təsdiqləmək üçün linkə keçid edin:\n\n" +
                        verificationLink
        );

        mailSender.send(message);
    }
}