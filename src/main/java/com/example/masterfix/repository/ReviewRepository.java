package com.example.masterfix.repository;

import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.Review;
import com.example.masterfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByMaster(Master master);

    List<Review> findByUser(User user);

    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);
}