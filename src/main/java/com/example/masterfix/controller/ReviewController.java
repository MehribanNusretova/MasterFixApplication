package com.example.masterfix.controller;

import com.example.masterfix.dto.request.ReviewRequest;
import com.example.masterfix.dto.response.ReviewResponse;
import com.example.masterfix.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponse createReview(
            Authentication authentication,
           @Valid @RequestBody ReviewRequest request
    ) {
        return reviewService.createReview(authentication, request);
    }

    @GetMapping("/master/{masterId}")
    public List<ReviewResponse> getReviewsByMaster(@Valid @PathVariable Long masterId) {
        return reviewService.getReviewsByMaster(masterId);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(
            Authentication authentication,
           @Valid @PathVariable Long id
    ) {
        reviewService.deleteReview(authentication, id);
    }

    @GetMapping("/my")
    public List<ReviewResponse> getMyReviews(Authentication authentication) {
        return reviewService.getMyReviews(authentication);
    }


    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteReviewByAdmin(@PathVariable Long id) {
        reviewService.deleteReviewByAdmin(id);
    }
}