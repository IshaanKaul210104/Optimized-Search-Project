package com.Ishaan.ecom_proj.controller;

import com.Ishaan.ecom_proj.model.Product;
import com.Ishaan.ecom_proj.service.ImageService;
import com.Ishaan.ecom_proj.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ObjectMapper objectMapper; // To parse JSON into Java objects

    // Endpoint to get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    // Endpoint to get a specific product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to update a product by ID
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Optional<Product> existingProductOptional = productService.findById(id);

        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();

            // Update the product fields
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setBrand(updatedProduct.getBrand());
            existingProduct.setCategory(updatedProduct.getCategory());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());

            Product savedProduct = productService.save(existingProduct);
            return ResponseEntity.ok(savedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to add a new product with an image
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestParam("productJson") String productJson,
            @RequestParam("imageFile") MultipartFile imageFile) {
        try {
            // Convert productJson (String) to a Product object using ObjectMapper
            Product product = objectMapper.readValue(productJson, Product.class);

            // Save the product in the database
            Product savedProduct = productService.save(product);

            // Save the image and associate it with the product
            String imageName = imageService.saveProductImage(imageFile, savedProduct.getId());
            savedProduct.setImageName(imageName);

            // Update the product with the image information
            productService.save(savedProduct);

            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            // Log and handle exceptions
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to get a product's image
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) throws IOException {
        Optional<Product> productOptional = productService.findById(id);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            byte[] image = imageService.getImageForProduct(product.getImageName()); // Logic for fetching image from storage

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG) // Adjust if you have different image types (PNG, etc.)
                    .body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to delete a product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> productOptional = productService.findById(id);

        if (productOptional.isPresent()) {
            productService.deleteById(id);
            return ResponseEntity.noContent().build(); // Respond with 204 No Content on successful deletion
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Enhanced search endpoint using TF-IDF and inverted indexing
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> searchResults = productService.searchProductsUsingTFIDF(keyword);
        if (searchResults.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no results found
        }
        return ResponseEntity.ok(searchResults);
    }

    // Endpoint to get products filtered by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.findByCategory(category);
    }
}
