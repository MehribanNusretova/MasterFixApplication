package com.example.masterfix.service;

import com.example.masterfix.dto.request.MessageRequest;
import com.example.masterfix.dto.response.MessageResponse;
import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Message;
import com.example.masterfix.entity.User;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.BookingRepository;
import com.example.masterfix.repository.MessageRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public MessageResponse sendMessage(Authentication authentication, Long bookingId, MessageRequest request) {
        String email = authentication.getName();
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Sifariş tapılmadı"));

        User receiver;
        if (booking.getUser().getId().equals(sender.getId())) {
            receiver = booking.getMaster().getUser();
        } else if (booking.getMaster().getUser().getId().equals(sender.getId())) {
            receiver = booking.getUser();
        } else {
            throw new AccessDeniedException("Bu sifarişə mesaj göndərə bilməzsiniz");
        }

        Message message = Message.builder()
                .booking(booking)
                .sender(sender)
                .receiver(receiver)
                .content(request.content())
                .read(false)
                .build();

        Message saved = messageRepository.save(message);
        return mapToResponse(saved);
    }

    public List<MessageResponse> getMessages(Authentication authentication, Long bookingId) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Sifariş tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId()) && !booking.getMaster().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu sifarişin mesajlarını görə bilməzsiniz");
        }

        return messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private MessageResponse mapToResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getBooking().getId(),
                message.getSender().getId(),
                message.getSender().getFirstName() + " " + message.getSender().getLastName(),
                message.getContent(),
                message.getCreatedAt(),
                message.isRead()
        );
    }
}
