package com.example.masterfix.service;

import com.example.masterfix.dto.request.BookingRequest;
import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.BookingStatusEnum;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.BookingRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MasterRepository masterRepository;
    private final EmailService emailService;


    public BookingResponse createBooking(Authentication authentication, BookingRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findById(request.masterId())
                .orElseThrow(() -> new ResourceNotFoundException("Master tapılmadı"));

        if (!master.isAvailable()) {
            throw new ResourceNotFoundException("Bu master hazırda sifariş qəbul etmir");
        }

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setMaster(master);
        booking.setDescription(request.description());
        booking.setAddress(request.address());
        booking.setBookingDate(request.bookingDate());
        booking.setBookingStatus(BookingStatusEnum.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Ustaya email bildirişi göndər
        try {
            emailService.sendBookingNotification(
                    master.getUser().getEmail(),
                    master.getUser().getFirstName(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getPhone(),
                    master.getCategory().getName(),
                    booking.getAddress(),
                    booking.getBookingDate().toString(),
                    booking.getDescription()
            );
        } catch (Exception e) {
            System.err.println("Sifariş emaili göndərilə bilmədi: " + e.getMessage());
        }

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    public List<BookingResponse> getMyMasterBookings(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        return bookingRepository.findByMaster(master)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    public BookingResponse acceptBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);
        
        if (booking.getBookingStatus() != BookingStatusEnum.PENDING) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız PENDING statusunda olan sifarişlər qəbul edilə bilər");
        }

        booking.setBookingStatus(BookingStatusEnum.ACCEPTED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }

    public BookingResponse rejectBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);

        if (booking.getBookingStatus() != BookingStatusEnum.PENDING) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız PENDING statusunda olan sifarişlər rədd edilə bilər");
        }

        booking.setBookingStatus(BookingStatusEnum.REJECTED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }

     @Transactional
    public BookingResponse completeBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);

        if (booking.getBookingStatus() != BookingStatusEnum.ACCEPTED) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız ACCEPTED statusunda olan sifarişlər tamamlana bilər");
        }

        booking.setBookingStatus(BookingStatusEnum.COMPLETED);

        Master master = booking.getMaster();
        master.setCompletedJobs(master.getCompletedJobs() + 1);
        masterRepository.save(master);

        return mapToBookingResponse(bookingRepository.save(booking));
    }


    public BookingResponse cancelBooking(Authentication authentication, Long bookingId) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu sifariş sizə aid deyil");
        }

        booking.setBookingStatus(BookingStatusEnum.CANCELLED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }


    private Booking getBookingForCurrentMaster(Authentication authentication, Long bookingId) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Sifariş tapılmadı"));

        if (!booking.getMaster().getId().equals(master.getId())) {
            throw new AccessDeniedException("Bu sifariş sizə aid deyil");
        }

        return booking;
    }


    private BookingResponse mapToBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                booking.getMaster().getUser().getFirstName() + " " + booking.getMaster().getUser().getLastName(),
                booking.getMaster().getId(),
                booking.getMaster().getCategory().getName(),
                booking.getDescription(),
                booking.getAddress(),
                booking.getBookingDate(),
                booking.getBookingStatus()
        );
    }
    public BookingResponse getBookingById(Authentication authentication, Long id) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("İstifadəçi tapılmadı"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sifariş tapılmadı"));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isMasterOfBooking = booking.getMaster().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equalsIgnoreCase("ADMIN");

        if (!isOwner && !isMasterOfBooking && !isAdmin) {
            throw new AccessDeniedException("Bu sifarişin detallarına baxmaq üçün icazəniz yoxdur!");
        }

        return mapToBookingResponse(booking);
    }
}
