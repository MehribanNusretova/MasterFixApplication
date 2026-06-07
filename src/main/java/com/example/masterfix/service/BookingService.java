package com.example.masterfix.service;

import com.example.masterfix.dto.request.BookingRequest;
import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.BookingStatusEnum;
import com.example.masterfix.repository.BookingRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * BookingService sifariş biznes məntiqini idarə edir.
 * User booking yaradır, öz bookinglərini görür,
 * master isə sifarişi qəbul/rədd/tamamlanmış edə bilir.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MasterRepository masterRepository;


    public BookingResponse createBooking(Authentication authentication, BookingRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findById(request.masterId())
                .orElseThrow(() -> new RuntimeException("Master tapılmadı"));

        if (!master.isAvailable()) {
            throw new RuntimeException("Bu master hazırda sifariş qəbul etmir");
        }

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setMaster(master);
        booking.setDescription(request.description());
        booking.setAddress(request.address());
        booking.setBookingDate(request.bookingDate());
        booking.setBookingStatus(BookingStatusEnum.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    public List<BookingResponse> getMyMasterBookings(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Master profili tapılmadı"));

        return bookingRepository.findByMaster(master)
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }


    public BookingResponse acceptBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);

        booking.setBookingStatus(BookingStatusEnum.ACCEPTED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }

    public BookingResponse rejectBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);

        booking.setBookingStatus(BookingStatusEnum.REJECTED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }


    public BookingResponse completeBooking(Authentication authentication, Long bookingId) {

        Booking booking = getBookingForCurrentMaster(authentication, bookingId);

        booking.setBookingStatus(BookingStatusEnum.COMPLETED);

        Master master = booking.getMaster();
        master.setCompletedJobs(master.getCompletedJobs() + 1);
        masterRepository.save(master);

        return mapToBookingResponse(bookingRepository.save(booking));
    }


    public BookingResponse cancelBooking(Authentication authentication, Long bookingId) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bu sifariş sizə aid deyil");
        }

        booking.setBookingStatus(BookingStatusEnum.CANCELLED);

        return mapToBookingResponse(bookingRepository.save(booking));
    }


    private Booking getBookingForCurrentMaster(Authentication authentication, Long bookingId) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Master profili tapılmadı"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Sifariş tapılmadı"));

        if (!booking.getMaster().getId().equals(master.getId())) {
            throw new RuntimeException("Bu sifariş sizə aid deyil");
        }

        return booking;
    }


    private BookingResponse mapToBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                booking.getMaster().getUser().getFirstName() + " " + booking.getMaster().getUser().getLastName(),
                booking.getMaster().getCategory().getName(),
                booking.getDescription(),
                booking.getAddress(),
                booking.getBookingDate(),
                booking.getBookingStatus()
        );
    }
}
