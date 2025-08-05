# Optimized-Search-Project

Optimized Search for E-commerce Website

## Project Overview

This project aims to enhance search functionality in an Amazon-clone e-commerce website. It utilizes TF-IDF (Term Frequency-Inverse Document Frequency) and Inverted Indexing to improve search efficiency and accuracy. The system is built using React for the frontend and Java (Spring Boot) for the backend, with MySQL as the database.

## Features

- **Efficient Search Mechanism**: Uses TF-IDF and Inverted Indexing for optimized product searches.
- **Search by Relevance**: Retrieves products based on product name, brand, category, and description.
- **Real-Time Updates**: Ensures search index updates dynamically when products are added, updated, or deleted.
- **Seamless Frontend-Backend Integration**: React-based UI connected with Java-based backend.
- **Database Connectivity**: Uses MySQL to store and retrieve product information.

## Tech Stack

### Frontend
- React.js
- Axios (for API calls)
- CSS / Styled Components

### Backend
- Java (Spring Boot)
- MySQL (JPA, Hibernate)
- TF-IDF Algorithm
- Inverted Indexing
- RESTful APIs

---

## 📁 Folder Structure

The project uses the following structure to keep the frontend and backend in separate folders:

```plaintext
Optimized-Search-Project/
├── Backend/ # Spring Boot project (Java)
├── Frontend/ # React.js project
├── ProjectPics/ # Images or diagrams used in the project
└── README.md # Project documentation
```

> ✅ You can open the `Frontend/` and `Backend/` folders in separate code editors or terminals as needed.

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js and npm (for frontend)
- Java 17+ (for backend)
- MySQL Workbench
- Spring Boot-compatible IDE (e.g., IntelliJ, Eclipse, VS Code)

---

### 🔧 Backend Setup (Spring Boot)

1. Navigate to the backend folder:

   ```bash
   cd Backend
   ```

2. Build the project using Maven:

```bash
./mvnw clean install       # macOS/Linux
mvnw.cmd clean install     # Windows
```

3. Run the Spring Boot application:

```bash
./mvnw spring-boot:run       # macOS/Linux
mvnw.cmd spring-boot:run     # Windows
```

4. Ensure that your MySQL database is running and application.properties is configured with correct DB credentials.

### 💻 Frontend Setup (React)

Open a new terminal and navigate to the frontend folder:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm run dev
```

4. Open http://localhost:5173 (or whichever port Vite specifies) in your browser to view the app.

## 🔗 API Endpoints

- GET /api/products - Fetch all products.
- GET /api/search?query=<keyword> - Search products using TF-IDF and Inverted Index.
- POST /api/products - Add a new product.
- PUT /api/products/{id} - Update a product.
- DELETE /api/products/{id} - Delete a product.

## 📈 Future Improvements

- Implementing vectorized search with embeddings for more accurate recommendations.
- Enhancing query auto-suggestions.
- Adding voice and image-based search capabilities.

## 👨‍💻 Contributors

- Ishaan Kaul - Full Stack Developer
