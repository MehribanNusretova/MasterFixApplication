package com.example.masterfix.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
public class Master {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false, unique = true)
    Category category;

    @NotBlank
    @Column(nullable = false, length = 1000)
    String description;

    @NotNull
    @Min(0)
    Integer ExperienceYear;

    @NotBlank
    @Column(nullable = false)
    String city;

    @NotBlank
    @Column(nullable = false)
    String address;

    @NotNull
    @PositiveOrZero
    Double priceFrom;

    @NotNull
    @Positive
    Double priceTo;

    @Column(nullable = false)
    boolean available = true;

    @Column(nullable = false)
    Double averageRating = 0.0;

    @Column(nullable = false)
    Integer completedJobs = 0;

    String profileImageUrl;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

}
