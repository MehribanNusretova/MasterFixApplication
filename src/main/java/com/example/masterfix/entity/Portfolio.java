package com.example.masterfix.entity;

import com.example.masterfix.enums.MediaType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_id", nullable = false)
    Master master;

    @Column(nullable = false)
    String title;

    @Column(length = 1000)
    String description;

    @Column(nullable = false)
    String mediaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    MediaType mediaType;

    @CreationTimestamp
    LocalDateTime createdAt;
}
