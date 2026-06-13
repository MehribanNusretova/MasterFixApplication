package com.example.masterfix.repository;

import com.example.masterfix.entity.Portfolio;
import com.example.masterfix.entity.Master;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByMasterOrderByCreatedAtDesc(Master master);
    List<Portfolio> findByMasterIdOrderByCreatedAtDesc(Long masterId);
}
