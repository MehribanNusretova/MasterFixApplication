package com.example.masterfix.controller;

import com.example.masterfix.dto.request.CategoryRequest;
import com.example.masterfix.dto.response.CategoryResponse;
import com.example.masterfix.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return categoryService.createCategory(request);
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public CategoryResponse getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.updateCategory(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
