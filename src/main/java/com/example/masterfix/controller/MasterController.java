package com.example.masterfix.controller;

import com.example.masterfix.dto.request.MasterRequest;
import com.example.masterfix.dto.response.MasterResponse;
import com.example.masterfix.service.MasterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public List<MasterResponse> getAllMasters() {
        return masterService.getAllMasters();
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
}