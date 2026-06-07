package com.example.masterfix.repository;

import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import io.micrometer.common.KeyValues;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MasterRepository extends JpaRepository<Master, Long> {

    Optional<Master> findByUser(User user);

    List<Master> findByCategory(Category category);

    List<Master> findByCityIgnoreCase(String city);

    List<Master> findByAvailableTrue();

    List<Master> findByCategoryId(Long categoryId);
}