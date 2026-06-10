package com.example.masterfix.service;

import com.example.masterfix.dto.request.MasterRequest;
import com.example.masterfix.dto.response.MasterResponse;
import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.CategoryRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterService {

    private final MasterRepository masterRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public MasterResponse createMaster(Authentication authentication, MasterRequest request) {

        validateMasterPrices(request);

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        if (masterRepository.findByUser(user).isPresent()) {
            throw new AlreadyExistsException("Bu user artıq master profilinə sahibdir");
        }


        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category tapılmadı"));

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

        user.setRole(Role.MASTER);
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
                .orElseThrow(() -> new ResourceNotFoundException("Master tapılmadı"));

        return mapToMasterResponse(master);
    }

    public MasterResponse updateMyMasterProfile(Authentication authentication, MasterRequest request) {

        validateMasterPrices(request);

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category tapılmadı"));

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
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

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

    private void validateMasterPrices(MasterRequest request) {
        if (request.priceFrom() != null && request.priceTo() != null && request.priceFrom() > request.priceTo()) {
            throw new IllegalArgumentException("Minimum qiymət maksimum qiymətdən böyük ola bilməz!");
        }
    }
    public List<MasterResponse> searchMasters(Long categoryId, String city) {
        return masterRepository.findAll()
                .stream()
                .filter(master -> categoryId == null || master.getCategory().getId().equals(categoryId))
                .filter(master -> city == null || city.trim().isEmpty() || master.getCity().equalsIgnoreCase(city.trim()))
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