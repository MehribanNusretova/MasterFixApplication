package com.example.masterfix.service;

import com.example.masterfix.dto.response.BookingResponse;
import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.BookingStatusEnum;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.BadRequestException;
import com.example.masterfix.repository.BookingRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    private static final String MASTER_EMAIL = "master@example.com";
    private static final String CUSTOMER_EMAIL = "customer@example.com";

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MasterRepository masterRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private BookingService bookingService;

    private User customer;
    private User masterUser;
    private Master master;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L)
                .firstName("Aysel")
                .lastName("Aliyeva")
                .email(CUSTOMER_EMAIL)
                .build();

        masterUser = User.builder()
                .id(2L)
                .firstName("Elshan")
                .lastName("Mammadov")
                .email(MASTER_EMAIL)
                .build();

        Category category = new Category();
        category.setId(1L);
        category.setName("Electrician");

        master = new Master();
        master.setId(10L);
        master.setUser(masterUser);
        master.setCategory(category);
        master.setCompletedJobs(3);
    }

    @Test
    @DisplayName("Master can accept a PENDING booking")
    void acceptBooking_whenPending_setsStatusToAccepted() {
        Booking booking = createBooking(BookingStatusEnum.PENDING);
        loginAsMasterOf(booking);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.acceptBooking(authentication, booking.getId());

        assertThat(response.bookingStatus()).isEqualTo(BookingStatusEnum.ACCEPTED);
        verify(bookingRepository).save(booking);
    }

    @Test
    @DisplayName("Only PENDING bookings can be accepted")
    void acceptBooking_whenNotPending_throwsBadRequest() {
        Booking booking = createBooking(BookingStatusEnum.COMPLETED);
        loginAsMasterOf(booking);

        assertThatThrownBy(() -> bookingService.acceptBooking(authentication, booking.getId()))
                .isInstanceOf(BadRequestException.class);

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Master cannot accept a booking of another master")
    void acceptBooking_whenBookingBelongsToAnotherMaster_throwsAccessDenied() {
        Master anotherMaster = new Master();
        anotherMaster.setId(99L);
        Booking booking = createBooking(BookingStatusEnum.PENDING);
        booking.setMaster(anotherMaster);
        loginAsMasterOf(booking);

        assertThatThrownBy(() -> bookingService.acceptBooking(authentication, booking.getId()))
                .isInstanceOf(AccessDeniedException.class);

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Completing an ACCEPTED booking increases the master's completed jobs")
    void completeBooking_whenAccepted_setsStatusToCompleted() {
        Booking booking = createBooking(BookingStatusEnum.ACCEPTED);
        loginAsMasterOf(booking);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.completeBooking(authentication, booking.getId());

        assertThat(response.bookingStatus()).isEqualTo(BookingStatusEnum.COMPLETED);
        assertThat(master.getCompletedJobs()).isEqualTo(4);
        verify(masterRepository).save(master);
    }

    @Test
    @DisplayName("A PENDING booking cannot be completed")
    void completeBooking_whenPending_throwsBadRequest() {
        Booking booking = createBooking(BookingStatusEnum.PENDING);
        loginAsMasterOf(booking);

        assertThatThrownBy(() -> bookingService.completeBooking(authentication, booking.getId()))
                .isInstanceOf(BadRequestException.class);

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Customer cannot cancel a COMPLETED booking")
    void cancelBooking_whenCompleted_throwsBadRequest() {
        Booking booking = createBooking(BookingStatusEnum.COMPLETED);
        when(authentication.getName()).thenReturn(CUSTOMER_EMAIL);
        when(userRepository.findByEmail(CUSTOMER_EMAIL)).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(authentication, booking.getId()))
                .isInstanceOf(BadRequestException.class);

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    private Booking createBooking(BookingStatusEnum status) {
        Booking booking = new Booking();
        booking.setId(100L);
        booking.setUser(customer);
        booking.setMaster(master);
        booking.setDescription("Fix the wiring in the kitchen");
        booking.setAddress("Baku");
        booking.setBookingDate(LocalDateTime.of(2026, 12, 1, 10, 0));
        booking.setBookingStatus(status);
        return booking;
    }

    private void loginAsMasterOf(Booking booking) {
        when(authentication.getName()).thenReturn(MASTER_EMAIL);
        when(userRepository.findByEmail(MASTER_EMAIL)).thenReturn(Optional.of(masterUser));
        when(masterRepository.findByUser(masterUser)).thenReturn(Optional.of(master));
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));
    }
}
