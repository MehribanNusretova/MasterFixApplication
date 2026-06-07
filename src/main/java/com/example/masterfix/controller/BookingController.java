package com.example.masterfix.controller;

import com.example.masterfix.dto.request.BookingRequest;
import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.service.BookingService;
import lombok.RequiredArgsConstructor;
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
            @RequestBody BookingRequest request
    ) {
        return bookingService.createBooking(authentication, request);
    }


    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        return bookingService.getMyBookings(authentication);
    }

    @GetMapping("/master")
    public List<BookingResponse> getMyMasterBookings(Authentication authentication) {
        return bookingService.getMyMasterBookings(authentication);
    }


    @PutMapping("/{id}/accept")
    public BookingResponse acceptBooking(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return bookingService.acceptBooking(authentication, id);
    }

    @PutMapping("/{id}/reject")
    public BookingResponse rejectBooking(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return bookingService.rejectBooking(authentication, id);
    }

    @PutMapping("/{id}/complete")
    public BookingResponse completeBooking(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return bookingService.completeBooking(authentication, id);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return bookingService.cancelBooking(authentication, id);
    }
}