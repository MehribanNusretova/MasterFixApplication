package com.example.masterfix.controller;

import com.example.masterfix.dto.request.MasterRequest;
import com.example.masterfix.dto.request.PortfolioRequest;
import com.example.masterfix.dto.response.MasterResponse;
import com.example.masterfix.dto.response.PortfolioResponse;
import com.example.masterfix.service.MasterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/masters")
@RequiredArgsConstructor
public class MasterController {

    private final MasterService masterService;

    @PostMapping
    public MasterResponse createMaster(
            Authentication authentication,
            @Valid @RequestBody MasterRequest request
    ) {
        return masterService.createMaster(authentication, request);
    }

    @GetMapping
    public Page<MasterResponse> getAllMasters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return masterService.getAllMasters(
                PageRequest.of(page, size, sort)
        );
    }

    @GetMapping("/{id}")
    public MasterResponse getMasterById(@PathVariable Long id) {
        return masterService.getMasterById(id);
    }

    @PutMapping("/me")
    public MasterResponse updateMyMasterProfile(
            Authentication authentication,
            @Valid @RequestBody MasterRequest request
    ) {
        return masterService.updateMyMasterProfile(authentication, request);
    }

    @DeleteMapping("/me")
    public void deleteMyMasterProfile(Authentication authentication) {
        masterService.deleteMyMasterProfile(authentication);
    }

    @GetMapping("/category/{categoryId}")
    public List<MasterResponse> getMastersByCategory(@PathVariable Long categoryId) {
        return masterService.getMastersByCategory(categoryId);
    }

    @GetMapping("/city")
    public List<MasterResponse> getMastersByCity(@RequestParam String city) {
        return masterService.getMastersByCity(city);
    }

    @GetMapping("/search")
    public Page<MasterResponse> searchMasters(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return masterService.searchMasters(
                city,
                categoryId,
                PageRequest.of(page, size, sort)
        );
    }

    @PostMapping("/me/profile-image")
    public MasterResponse uploadProfileImage(
            Authentication authentication,
            @RequestParam("image") MultipartFile image
    ) {
        return masterService.uploadProfileImage(authentication, image);
    }

    @PostMapping("/me/portfolio")
    @PreAuthorize("hasRole('MASTER')")
    public PortfolioResponse addPortfolioItem(
            Authentication authentication,
            @RequestPart("data") @Valid PortfolioRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        return masterService.addPortfolioItem(authentication, request, file);
    }

    @GetMapping("/{masterId}/portfolio")
    public List<PortfolioResponse> getPortfolio(@PathVariable Long masterId) {
        return masterService.getPortfolio(masterId);
    }

    @DeleteMapping("/me/portfolio/{id}")
    @PreAuthorize("hasRole('MASTER')")
    public void deletePortfolioItem(Authentication authentication, @PathVariable Long id) {
        masterService.deletePortfolioItem(authentication, id);
    }
}
