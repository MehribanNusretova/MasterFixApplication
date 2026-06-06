package com.example.masterfix.entity;

import com.example.masterfix.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor

@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements UserDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotBlank
    @Size(min = 3, max = 16)
    String firstName;

    @NotBlank
    @Size(min = 3, max = 16)
    String lastName;

    @NotBlank
    @Column(nullable = false,unique = true)
    @Size(min = 3, max = 16)
    String userName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    String email;

    @NotBlank(message = "Telefon nömrəsi boş ola bilməz")
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^(\\+994|0)(10|5[015]|7[07]|99)\\d{7}$", message = "Invalid Azerbaijan phone number format")
    String phone;

    @NotBlank()
    @Pattern(regexp = "^[a-zA-Z0-9]{6,16}$", message = "Username must be 6-12 alphanumeric characters")
    @Column(nullable = false)
    String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Role role;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

