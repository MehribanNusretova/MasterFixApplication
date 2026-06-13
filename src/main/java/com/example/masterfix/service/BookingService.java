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

        return bookingRepository.findByUserAndHiddenByUserFalse(user)
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


    @Transactional
    public BookingResponse acceptBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);
        
        if (booking.getBookingStatus() != BookingStatusEnum.PENDING) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız PENDING statusunda olan sifarişlər qəbul edilə bilər");
        }

        booking.setBookingStatus(BookingStatusEnum.ACCEPTED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
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


    @Transactional
    public BookingResponse cancelBooking(Authentication authentication, Long bookingId) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu sifariş sizə aid deyil");
        }
        
        if (booking.getBookingStatus() == BookingStatusEnum.COMPLETED) {
            throw new com.example.masterfix.exception.BadRequestException("Tamamlanmış sifarişi ləğv etmək olmaz");
        }

        booking.setBookingStatus(BookingStatusEnum.CANCELLED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void hideBooking(Authentication authentication, Long bookingId) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu sifariş sizə aid deyil");
        }

        if (booking.getBookingStatus() != BookingStatusEnum.CANCELLED && 
            booking.getBookingStatus() != BookingStatusEnum.REJECTED) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız ləğv edilmiş və ya rədd edilmiş sifarişləri gizlətmək olar");
        }

        booking.setHiddenByUser(true);
        bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Authentication authentication, Long bookingId) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu sifariş sizə aid deyil");
        }

        if (booking.getBookingStatus() != BookingStatusEnum.CANCELLED && 
            booking.getBookingStatus() != BookingStatusEnum.REJECTED) {
            throw new com.example.masterfix.exception.BadRequestException("Yalnız ləğv edilmiş və ya rədd edilmiş sifarişləri silmək olar");
        }

        bookingRepository.delete(booking);
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
        String userFullName = "Müştəri";
        if (booking.getUser() != null) {
            String firstName = booking.getUser().getFirstName() != null ? booking.getUser().getFirstName() : "";
            String lastName = booking.getUser().getLastName() != null ? booking.getUser().getLastName() : "";
            userFullName = (firstName + " " + lastName).trim();
            if (userFullName.isEmpty()) userFullName = "Müştəri";
        }

        String masterFullName = "Usta";
        Long masterId = null;
        String masterCategory = "Xidmət";

        if (booking.getMaster() != null) {
            masterId = booking.getMaster().getId();
            if (booking.getMaster().getUser() != null) {
                String firstName = booking.getMaster().getUser().getFirstName() != null ? booking.getMaster().getUser().getFirstName() : "";
                String lastName = booking.getMaster().getUser().getLastName() != null ? booking.getMaster().getUser().getLastName() : "";
                masterFullName = (firstName + " " + lastName).trim();
                if (masterFullName.isEmpty()) masterFullName = "Usta";
            }
            if (booking.getMaster().getCategory() != null) {
                masterCategory = booking.getMaster().getCategory().getName() != null ? booking.getMaster().getCategory().getName() : "Xidmət";
            }
        }

        return new BookingResponse(
                booking.getId(),
                userFullName,
                masterFullName,
                masterId,
                masterCategory,
                booking.getDescription() != null ? booking.getDescription() : "",
                booking.getAddress() != null ? booking.getAddress() : "",
                booking.getBookingDate(),
                booking.getBookingStatus() != null ? booking.getBookingStatus() : BookingStatusEnum.PENDING
        );
    }

    public BookingResponse getBookingById(Authentication authentication, Long id) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("İstifadəçi tapılmadı"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sifariş tapılmadı"));

        boolean isOwner = booking.getUser() != null && booking.getUser().getId().equals(user.getId());
        
        boolean isMasterOfBooking = false;
        if (booking.getMaster() != null && booking.getMaster().getUser() != null) {
            isMasterOfBooking = booking.getMaster().getUser().getId().equals(user.getId());
        }
        
        boolean isAdmin = user.getRole() != null && user.getRole().name().equalsIgnoreCase("ADMIN");

        if (!isOwner && !isMasterOfBooking && !isAdmin) {
            throw new AccessDeniedException("Bu sifarişin detallarına baxmaq üçün icazəniz yoxdur!");
        }

        return mapToBookingResponse(booking);
    }
}
