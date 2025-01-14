package com.Ishaan.ecom_proj.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {

    @Value("${product.images.upload-dir}")
    private String uploadDir;

    // Save product image and return the image name
    public String saveProductImage(MultipartFile imageFile, Long productId) throws IOException {
        if (imageFile.isEmpty()) {
            throw new IOException("Image file is empty");
        }

        // Generate a unique image name using product ID and original filename
        String imageName = productId + "_" + sanitizeFileName(imageFile.getOriginalFilename());
        Path path = Paths.get(uploadDir, imageName);

        // Ensure the directory exists
        Files.createDirectories(path.getParent());

        // Save the file to the specified path
        imageFile.transferTo(path.toFile());

        return imageName;
    }

    // Fetch image data for a given product
    public byte[] getImageForProduct(String imageName) throws IOException {
        if (imageName == null || imageName.isEmpty()) {
            throw new IOException("Image name is invalid");
        }

        Path path = Paths.get(uploadDir, imageName);

        // Ensure the file exists
        if (!Files.exists(path)) {
            throw new IOException("Image file not found: " + imageName);
        }

        return Files.readAllBytes(path);
    }

    // Helper method to sanitize file names to prevent security risks
    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
