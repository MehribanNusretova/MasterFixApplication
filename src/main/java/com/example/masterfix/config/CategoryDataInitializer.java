package com.example.masterfix.config;

import com.example.masterfix.entity.Category;
import com.example.masterfix.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoryDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = List.of(
                    createCategory("Elektrik ustası", "Elektrik montajı və təmiri xidmətləri"),
                    createCategory("Santexnik", "Su boruları və santexnika quraşdırılması"),
                    createCategory("Kondisioner", "Kondisionerlərin təmiri və quraşdırılması"),
                    createCategory("Kompüter təmiri", "Noutbuk və fərdi kompüterlərin təmiri"),
                    createCategory("Mebel ustası", "Mebellərin yığılması və bərpası"),
                    createCategory("Rəngsaz", "Daxili və xarici boya işləri"),
                    createCategory("Təmizlik xidməti", "Ev və ofis təmizliyi xidmətləri"),
                    createCategory("Kombi ustası", "İstilik sistemləri və kombi təmiri")
            );

            categoryRepository.saveAll(defaultCategories);
            System.out.println("Default categories successfully initialized.");
        }
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setActive(true);
        return category;
    }
}
