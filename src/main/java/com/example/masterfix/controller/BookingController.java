package com.example.masterfix.controller;

import com.example.masterfix.dto.request.BookingRequest;
import com.example.masterfix.dto.request.MessageRequest;
import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.dto.response.MessageResponse;
import com.example.masterfix.service.BookingService;
import com.example.masterfix.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final MessageService messageService;

    @PostMapping
    public BookingResponse createBooking(
            Authentication authentication,
           @Valid @RequestBody BookingRequest request
    ) {
        return bookingService.createBooking(authentication, request);
    }


    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        return bookingService.getMyBookings(authentication);
    }

    @GetMapping("/master")
    @PreAuthorize("hasRole('MASTER')")
    public List<BookingResponse> getMyMasterBookings(Authentication authentication) {
        return bookingService.getMyMasterBookings(authentication);
    }


    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('MASTER')")
    public BookingResponse acceptBooking(
            Authentication authentication,
            @Valid @PathVariable Long id
    ) {
        return bookingService.acceptBooking(authentication, id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MASTER')")
    public BookingResponse rejectBooking(
            Authentication authentication,
           @Valid @PathVariable Long id
    ) {
        return bookingService.rejectBooking(authentication, id);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('MASTER')")
    public BookingResponse completeBooking(
            Authentication authentication,
            @Valid @PathVariable Long id
    ) {
        return bookingService.completeBooking(authentication, id);
    }

    @GetMapping("/{id}")
    public BookingResponse getBookingById(Authentication authentication, @PathVariable Long id) {
        return bookingService.getBookingById(authentication, id);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(
            Authentication authentication,
            @Valid @PathVariable Long id
    ) {
        return bookingService.cancelBooking(authentication, id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(
            Authentication authentication,
            @PathVariable Long id
    ) {
        bookingService.deleteBooking(authentication, id);
    }

    @PatchMapping("/{id}/status")
    public BookingResponse updateBookingStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> statusUpdate
    ) {
        String status = statusUpdate.get("status");
        com.example.masterfix.enums.BookingStatusEnum statusEnum = com.example.masterfix.enums.BookingStatusEnum.valueOf(status);
        
        if (statusEnum == com.example.masterfix.enums.BookingStatusEnum.ACCEPTED) {
            return bookingService.acceptBooking(authentication, id);
        } else if (statusEnum == com.example.masterfix.enums.BookingStatusEnum.REJECTED) {
            return bookingService.rejectBooking(authentication, id);
        } else if (statusEnum == com.example.masterfix.enums.BookingStatusEnum.COMPLETED) {
            return bookingService.completeBooking(authentication, id);
        }
        
        throw new com.example.masterfix.exception.BadRequestException("Yanlış status");
    }

    @PostMapping("/{id}/messages")
    public MessageResponse sendMessage(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody MessageRequest request
    ) {
        return messageService.sendMessage(authentication, id, request);
    }

    @GetMapping("/{id}/messages")
    public List<MessageResponse> getMessages(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return messageService.getMessages(authentication, id);
    }
}
