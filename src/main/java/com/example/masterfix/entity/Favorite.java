package com.example.masterfix.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "master_id"})
        }
)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "master_id", nullable = false)
    Master master;

    @CreationTimestamp
    LocalDateTime createdAt;
}