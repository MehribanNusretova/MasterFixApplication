package com.example.masterfix.repository;

import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.BookingStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);
    List<Booking> findByUserAndHiddenByUserFalse(User user);

    List<Booking> findByMaster(Master master);

    List<Booking> findByBookingStatus(BookingStatusEnum bookingStatus);
    List<Booking> getBookingById(Long id);
}