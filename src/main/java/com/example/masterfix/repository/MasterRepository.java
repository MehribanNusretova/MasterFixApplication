package com.example.masterfix.repository;

import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MasterRepository extends JpaRepository<Master, Long> {

    Optional<Master> findByUser(User user);

    List<Master> findByCategory(Category category);

    List<Master> findByCityIgnoreCase(String city);

    List<Master> findByAvailableTrue();

    List<Master> findByCategoryId(Long categoryId);

    List<Master> findByCityIgnoreCaseAndAvailableTrue(String city);

    List<Master> findByCategoryIdAndAvailableTrue(Long categoryId);

    List<Master> findByCityIgnoreCaseAndCategoryIdAndAvailableTrue(String city, Long categoryId);

    Page<Master> findByAvailableTrue(Pageable pageable);

    Page<Master> findByCityIgnoreCaseAndAvailableTrue(String city, Pageable pageable);

    Page<Master> findByCategoryIdAndAvailableTrue(Long categoryId, Pageable pageable);

    Page<Master> findByCityIgnoreCaseAndCategoryIdAndAvailableTrue(
            String city,
            Long categoryId,
            Pageable pageable
    );
}