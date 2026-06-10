package com.example.masterfix.controller;

import com.example.masterfix.dto.response.FavoriteResponse;
import com.example.masterfix.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{masterId}")
    public FavoriteResponse addFavorite(
            Authentication authentication,
            @Valid @PathVariable Long masterId
    ) {
        return favoriteService.addFavorite(authentication, masterId);
    }

    @DeleteMapping("/{masterId}")
    public void removeFavorite(
            Authentication authentication,
            @Valid @PathVariable Long masterId
    ) {
        favoriteService.removeFavorite(authentication, masterId);
    }


    @GetMapping("/my")
    public List<FavoriteResponse> getMyFavorites(Authentication authentication) {
        return favoriteService.getMyFavorites(authentication);
    }
}