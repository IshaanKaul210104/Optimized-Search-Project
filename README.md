# Optimized-Search-Project
Optimized Search for E-commerce Website

Project Overview:
This project aims to enhance search functionality in an Amazon-clone e-commerce website. It utilizes TF-IDF (Term Frequency-Inverse Document Frequency) and Inverted Indexing to improve search efficiency and accuracy. The system is built using React for the frontend and Java (Spring Boot) for the backend, with MySQL as the database.

Features:
Efficient Search Mechanism: Uses TF-IDF and Inverted Indexing for optimized product searches.
Search by Relevance: Retrieves products based on product name, brand, category, and description.
Real-Time Updates: Ensures search index updates dynamically when products are added, updated, or deleted.
Seamless Frontend-Backend Integration: React-based UI connected with Java-based backend.
Database Connectivity: Uses MySQL to store and retrieve product information.

Tech Stack:

Frontend:
React.js
Axios (for API calls)
CSS/Styled Components

Backend:
Java (Spring Boot)
MySQL (JPA, Hibernate)
TF-IDF Algorithm
Inverted Indexing
RESTful APIs

Installation & Setup:

Prerequisites:
Node.js and npm (for frontend)
Java 17+
MySQL Workbench
Spring Boot

API Endpoints

GET /api/products - Fetch all products.
GET /api/search?query=<keyword> - Search products using TF-IDF and Inverted Index.
POST /api/products - Add a new product.
PUT /api/products/{id} - Update a product.
DELETE /api/products/{id} - Delete a product.

Future Improvements

Implementing vectorized search with embeddings for more accurate recommendations.
Enhancing query auto-suggestions.
Adding voice and image-based search capabilities.

Contributors

Ishaan Kaul - Full Stack Developer
