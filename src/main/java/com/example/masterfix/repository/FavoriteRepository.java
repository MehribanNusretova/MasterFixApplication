package com.example.masterfix.repository;

import com.example.masterfix.entity.Favorite;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUser(User user);

    boolean existsByUserAndMaster(User user, Master master);

    Optional<Favorite> findByUserAndMaster(User user, Master master);
}