package com.example.masterfix.service;

import com.example.masterfix.dto.request.MasterRequest;
import com.example.masterfix.dto.response.MasterResponse;
import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.repository.CategoryRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * MasterService usta profili ilə bağlı biznes məntiqini saxlayır.
 * Burada master yaratmaq, göstərmək, update etmək və silmək/deaktiv etmək olur.
 */
@Service
@RequiredArgsConstructor
public class MasterService {

    private final MasterRepository masterRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;


    public MasterResponse createMaster(Authentication authentication, MasterRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        if (masterRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Bu user artıq master profilinə sahibdir");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category tapılmadı"));

        Master master = new Master();

        master.setUser(user);
        master.setCategory(category);
        master.setDescription(request.description());
        master.setExperienceYear(request.experienceYear());
        master.setCity(request.city());
        master.setAddress(request.address());
        master.setPriceFrom(request.priceFrom());
        master.setPriceTo(request.priceTo());
        master.setAvailable(true);

        user.setRole(Role.Master);

        userRepository.save(user);

        Master savedMaster = masterRepository.save(master);

        return mapToMasterResponse(savedMaster);
    }

    public List<MasterResponse> getAllMasters() {
        return masterRepository.findAll()
                .stream()
                .filter(Master::isAvailable)
                .map(this::mapToMasterResponse)
                .toList();
    }


    public MasterResponse getMasterById(Long id) {

        Master master = masterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Master tapılmadı"));

        return mapToMasterResponse(master);
    }

    public MasterResponse updateMyMasterProfile(Authentication authentication, MasterRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Master profili tapılmadı"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category tapılmadı"));

        master.setCategory(category);
        master.setDescription(request.description());
        master.setExperienceYear(request.experienceYear());
        master.setCity(request.city());
        master.setAddress(request.address());
        master.setPriceFrom(request.priceFrom());
        master.setPriceTo(request.priceTo());

        Master updatedMaster = masterRepository.save(master);

        return mapToMasterResponse(updatedMaster);
    }


    public void deleteMyMasterProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Master profili tapılmadı"));

        master.setAvailable(false);

        masterRepository.save(master);
    }


    public List<MasterResponse> getMastersByCategory(Long categoryId) {
        return masterRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToMasterResponse)
                .toList();
    }


    public List<MasterResponse> getMastersByCity(String city) {
        return masterRepository.findByCityIgnoreCase(city)
                .stream()
                .map(this::mapToMasterResponse)
                .toList();
    }


    private MasterResponse mapToMasterResponse(Master master) {
        return new MasterResponse(
                master.getId(),
                master.getUser().getFirstName() + " " + master.getUser().getLastName(),
                master.getCategory().getName(),
                master.getDescription(),
                master.getExperienceYear(),
                master.getCity(),
                master.getAddress(),
                master.getPriceFrom(),
                master.getPriceTo(),
                master.isAvailable(),
                master.getAverageRating(),
                master.getCompletedJobs(),
                master.getProfileImageUrl()
        );
    }
}