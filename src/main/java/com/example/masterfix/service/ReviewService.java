package com.example.masterfix.service;

import com.example.masterfix.dto.request.ReviewRequest;
import com.example.masterfix.dto.response.ReviewResponse;
import com.example.masterfix.entity.Booking;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.Review;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.BookingStatusEnum;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.exception.BadRequestException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.BookingRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.ReviewRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MasterRepository masterRepository;

    public ReviewResponse createReview(Authentication authentication, ReviewRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking tapılmadı"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu booking sizə aid deyil");
        }

        if (booking.getBookingStatus() != BookingStatusEnum.COMPLETED) {
            throw new BadRequestException("Yalnız tamamlanmış booking üçün review yazmaq olar");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new AlreadyExistsException("Bu booking üçün artıq review yazılıb");
        }

        Review review = new Review();
        review.setUser(user);
        review.setMaster(booking.getMaster());
        review.setBooking(booking);
        review.setRating(request.rating());
        review.setComment(request.comment());

        Review savedReview = reviewRepository.save(review);
        updateMasterAverageRating(booking.getMaster());

        return mapToReviewResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByMaster(Long masterId) {
        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Master tapılmadı"));

        return reviewRepository.findByMaster(master)
                .stream()
                .map(this::mapToReviewResponse)
                .toList();
    }

    private void updateMasterAverageRating(Master master) {
        List<Review> reviews = reviewRepository.findByMaster(master);

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        master.setAverageRating(average);
        masterRepository.save(master);
    }

    public void deleteReview(Authentication authentication, Long reviewId) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review tapılmadı"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Bu review sizə aid deyil");
        }

        Master master = review.getMaster();
        reviewRepository.delete(review);
        updateMasterAverageRating(master);
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getUser().getFirstName() + " " + review.getUser().getLastName(),
                review.getMaster().getUser().getFirstName() + " " + review.getMaster().getUser().getLastName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
    public List<ReviewResponse> getMyReviews(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("İstifadəçi tapılmadı"));


        return reviewRepository.findByUser(user)
                .stream()
                .map(this::mapToReviewResponse)
                .toList();
    }

    public void deleteReviewByAdmin(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rəy tapılmadı"));

        Master master = review.getMaster();


        reviewRepository.delete(review);

        updateMasterAverageRating(master);
    }
}