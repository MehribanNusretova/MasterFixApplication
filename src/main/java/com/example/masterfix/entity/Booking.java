package com.example.masterfix.entity;

import com.example.masterfix.enums.BookingStatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor

@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "master_id", nullable = false)
    Master master;

    @NotBlank
    @Column(nullable = false, length = 1000)
    String description;

    @NotBlank
    @Column(nullable = false)
    String address;

    @NotNull
    @Column(nullable = false)
    LocalDateTime bookingDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BookingStatusEnum bookingStatus = BookingStatusEnum.PENDING;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    boolean hiddenByUser = false;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

}
