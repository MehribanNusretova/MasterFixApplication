package com.example.masterfix.repository;

import com.example.masterfix.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByBookingIdOrderByCreatedAtAsc(Long bookingId);
}
