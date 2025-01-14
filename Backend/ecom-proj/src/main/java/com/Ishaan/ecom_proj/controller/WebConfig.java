package com.Ishaan.ecom_proj.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for all endpoints in the app
        registry.addMapping("/**")  // Apply to all endpoints
                .allowedOrigins("http://localhost:5173")  // Allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific HTTP methods
                .allowedHeaders("*");  // Allow all headers
    }
}
