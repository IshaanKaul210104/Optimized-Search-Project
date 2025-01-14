package com.Ishaan.ecom_proj.repo;

import com.Ishaan.ecom_proj.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {

    // Custom query to search products by name, description, brand, or category
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String name, String description, String brand, String category);

    // Find products by category
    List<Product> findByCategory(String category);
}
