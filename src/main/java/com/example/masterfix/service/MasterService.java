package com.example.masterfix.service;

import com.example.masterfix.dto.request.MasterRequest;
import com.example.masterfix.dto.request.PortfolioRequest;
import com.example.masterfix.dto.response.MasterResponse;
import com.example.masterfix.dto.response.PortfolioResponse;
import com.example.masterfix.entity.Category;
import com.example.masterfix.entity.Master;
import com.example.masterfix.entity.Portfolio;
import com.example.masterfix.entity.User;
import com.example.masterfix.enums.Role;
import com.example.masterfix.exception.AccessDeniedException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.repository.CategoryRepository;
import com.example.masterfix.repository.MasterRepository;
import com.example.masterfix.repository.PortfolioRepository;
import com.example.masterfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterService {

    private final MasterRepository masterRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final PortfolioRepository portfolioRepository;

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
            throw new IllegalArgumentException("Minimum qiymət maksimum qiymətdən böyük ola bilər!");
        }
    }
    public Page<MasterResponse> searchMasters(String city, Long categoryId, Pageable pageable) {

        if (city != null && !city.isBlank() && categoryId != null) {
            return masterRepository
                    .findByCityIgnoreCaseAndCategoryIdAndAvailableTrue(city, categoryId, pageable)
                    .map(this::mapToMasterResponse);
        }

        if (city != null && !city.isBlank()) {
            return masterRepository
                    .findByCityIgnoreCaseAndAvailableTrue(city, pageable)
                    .map(this::mapToMasterResponse);
        }

        if (categoryId != null) {
            return masterRepository
                    .findByCategoryIdAndAvailableTrue(categoryId, pageable)
                    .map(this::mapToMasterResponse);
        }

        return masterRepository.findByAvailableTrue(pageable)
                .map(this::mapToMasterResponse);
    }

    public Page<MasterResponse> getAllMasters(Pageable pageable) {
        return masterRepository.findByAvailableTrue(pageable)
                .map(this::mapToMasterResponse);
    }

    public MasterResponse uploadProfileImage(Authentication authentication, MultipartFile image) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        String imageUrl = fileStorageService.saveImage(image);
        master.setProfileImageUrl(imageUrl);

        return mapToMasterResponse(masterRepository.save(master));
    }

    public PortfolioResponse addPortfolioItem(Authentication authentication, PortfolioRequest request, MultipartFile file) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        String mediaUrl = fileStorageService.saveMedia(file);
        Portfolio portfolio = Portfolio.builder()
                .master(master)
                .title(request.title())
                .description(request.description())
                .mediaUrl(mediaUrl)
                .mediaType(request.mediaType())
                .build();

        Portfolio saved = portfolioRepository.save(portfolio);
        return mapToPortfolioResponse(saved);
    }

    public List<PortfolioResponse> getPortfolio(Long masterId) {
        return portfolioRepository.findByMasterIdOrderByCreatedAtDesc(masterId)
                .stream()
                .map(this::mapToPortfolioResponse)
                .toList();
    }

    public void deletePortfolioItem(Authentication authentication, Long portfolioId) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User tapılmadı"));

        Master master = masterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Master profili tapılmadı"));

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio tapılmadı"));

        if (!portfolio.getMaster().getId().equals(master.getId())) {
            throw new AccessDeniedException("Bu portfolio sizə aid deyil");
        }

        portfolioRepository.delete(portfolio);
    }


    private MasterResponse mapToMasterResponse(Master master) {
        String fullName = "Usta";
        if (master.getUser() != null) {
            String firstName = master.getUser().getFirstName() != null ? master.getUser().getFirstName() : "";
            String lastName = master.getUser().getLastName() != null ? master.getUser().getLastName() : "";
            fullName = (firstName + " " + lastName).trim();
            if (fullName.isEmpty()) fullName = "Usta";
        }

        String categoryName = "Xidmət";
        if (master.getCategory() != null) {
            categoryName = master.getCategory().getName() != null ? master.getCategory().getName() : "Xidmət";
        }

        return new MasterResponse(
                master.getId(),
                fullName,
                categoryName,
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

    private PortfolioResponse mapToPortfolioResponse(Portfolio portfolio) {
        return new PortfolioResponse(
                portfolio.getId(),
                portfolio.getTitle(),
                portfolio.getDescription(),
                portfolio.getMediaUrl(),
                portfolio.getMediaType(),
                portfolio.getCreatedAt()
        );
    }
}
