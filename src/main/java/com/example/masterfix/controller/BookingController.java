package com.example.masterfix.controller;

import com.example.masterfix.dto.request.BookingRequest;
import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.service.BookingService;
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
}