package com.example.masterfix.service;

import com.example.masterfix.dto.request.CategoryRequest;
import com.example.masterfix.dto.response.CategoryResponse;
import com.example.masterfix.entity.Category;
import com.example.masterfix.exception.AlreadyExistsException;
import com.example.masterfix.exception.ResourceNotFoundException;
import com.example.masterfix.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;


    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByName(request.name())) {
            throw new AlreadyExistsException("Bu category artıq mövcuddur");
        }

        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        category.setActive(true);

        Category savedCategory = categoryRepository.save(category);

        return mapToCategoryResponse(savedCategory);
    }


    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .filter(Category::isActive)
                .map(this::mapToCategoryResponse)
                .toList();
    }


    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category tapılmadı"));

        return mapToCategoryResponse(category);
    }


    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category tapılmadı"));

        category.setName(request.name());
        category.setDescription(request.description());

        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryResponse(updatedCategory);
    }


    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category tapılmadı"));

        category.setActive(false);

        categoryRepository.save(category);
    }


    private CategoryResponse mapToCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive()
        );
    }
}
