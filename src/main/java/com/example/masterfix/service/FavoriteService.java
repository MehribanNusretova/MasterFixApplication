package com.example.masterfix.service;

import com.example.masterfix.dto.response.FavoriteResponse;
import com.example.masterfix.entity.Favorite;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.repository.FavoriteRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final MasterRepository masterRepository;


    public FavoriteResponse addFavorite(Authentication authentication, Long masterId) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new RuntimeException("Master tapılmadı"));

        if (favoriteRepository.existsByUserAndMaster(user, master)) {
            throw new RuntimeException("Bu master artıq favorite siyahısındadır");
        }

        Favorite favorite = new Favorite();

        favorite.setUser(user);
        favorite.setMaster(master);

        Favorite savedFavorite = favoriteRepository.save(favorite);

        return mapToFavoriteResponse(savedFavorite);
    }


    public void removeFavorite(Authentication authentication, Long masterId) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new RuntimeException("Master tapılmadı"));

        Favorite favorite = favoriteRepository.findByUserAndMaster(user, master)
                .orElseThrow(() -> new RuntimeException("Favorite tapılmadı"));

        favoriteRepository.delete(favorite);
    }


    public List<FavoriteResponse> getMyFavorites(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        return favoriteRepository.findByUser(user)
                .stream()
                .map(this::mapToFavoriteResponse)
                .toList();
    }


    private FavoriteResponse mapToFavoriteResponse(Favorite favorite) {

        Master master = favorite.getMaster();

        return new FavoriteResponse(
                favorite.getId(),
                master.getId(),
                master.getUser().getFirstName() + " " + master.getUser().getLastName(),
                master.getCategory().getName(),
                master.getCity(),
                master.getAverageRating()
        );
    }
}