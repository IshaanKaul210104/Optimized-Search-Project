package com.Ishaan.ecom_proj.service;

import com.Ishaan.ecom_proj.model.Product;
import com.Ishaan.ecom_proj.repo.ProductRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepository;

    // Inverted index for name and description
    private final Map<String, List<Product>> invertedIndex = new HashMap<>();
    private final List<String[]> productDescriptions = new ArrayList<>();

    // Initialize the inverted index at startup
    @PostConstruct
    public synchronized void initializeIndex() {
        List<Product> allProducts = findAll();
        invertedIndex.clear();
        productDescriptions.clear();

        for (Product product : allProducts) {
            String[] nameTerms = extractTerms(product.getName());
            String[] descriptionTerms = extractTerms(product.getDescription());
            productDescriptions.add(descriptionTerms);

            // Logging for debugging
            System.out.println("Product: " + product.getName());
            System.out.println("Name Terms: " + Arrays.toString(nameTerms));
            System.out.println("Description Terms: " + Arrays.toString(descriptionTerms));

            // Index both name and description
            for (String term : nameTerms) {
                invertedIndex.computeIfAbsent(term, k -> new ArrayList<>()).add(product);
            }
            for (String term : descriptionTerms) {
                invertedIndex.computeIfAbsent(term, k -> new ArrayList<>()).add(product);
            }
        }

        // Log final inverted index
        System.out.println("Inverted Index: " + invertedIndex);
    }

    public Product save(Product product) {
        Product savedProduct = productRepository.save(product);
        initializeIndex();
        return savedProduct;
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
        initializeIndex();
    }

    public Product saveProductFromJson(String productJson) {
        Product product = convertJsonToProduct(productJson);
        return save(product);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProductsUsingTFIDF(String keyword) {
        keyword = normalizeKeyword(keyword);
        System.out.println("Normalized Keyword: " + keyword);

        if (!invertedIndex.containsKey(keyword)) {
            System.out.println("Keyword not found in inverted index, searching for partial matches.");
            return searchForPartialMatches(keyword);
        }

        List<Product> matchingProducts = invertedIndex.get(keyword);
        System.out.println("Matching Products: " + matchingProducts);

        Map<Product, Double> productScores = computeTFIDFScores(matchingProducts, keyword);
        System.out.println("TF-IDF Scores: " + productScores);

        return productScores.entrySet()
                .stream()
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()))
                .map(Map.Entry::getKey)
                .toList();
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null ? "" : keyword.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").trim();
    }

    private String[] extractTerms(String input) {
        return input == null ? new String[0] : input.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+");
    }

    private List<Product> searchForPartialMatches(String keyword) {
        System.out.println("Searching for partial matches with keyword: " + keyword);
        List<Product> partialMatches = new ArrayList<>();

        for (Map.Entry<String, List<Product>> entry : invertedIndex.entrySet()) {
            if (entry.getKey().contains(keyword)) {
                System.out.println("Found partial match for term: " + entry.getKey());
                partialMatches.addAll(entry.getValue());
            }
        }
        return partialMatches;
    }

    private Map<Product, Double> computeTFIDFScores(List<Product> products, String keyword) {
        Map<Product, Double> productScores = new HashMap<>();
        for (Product product : products) {
            String[] terms = extractTerms(product.getDescription());
            Map<String, Double> tfidfScores = computeTFIDF(terms, productDescriptions);
            productScores.put(product, tfidfScores.getOrDefault(keyword, 0.0));
        }
        return productScores;
    }

    private Map<String, Double> computeTFIDF(String[] productDesc, List<String[]> allDescriptions) {
        Map<String, Double> tfidfScores = new HashMap<>();
        Set<String> uniqueTerms = new HashSet<>(Arrays.asList(productDesc));

        for (String term : uniqueTerms) {
            double tf = computeTF(productDesc, term);
            double idf = computeIDF(allDescriptions, term);
            tfidfScores.put(term, tf * idf);

            // Logging TF-IDF scores
            System.out.println("Term: " + term + ", TF: " + tf + ", IDF: " + idf + ", TF-IDF: " + (tf * idf));
        }
        return tfidfScores;
    }

    private double computeTF(String[] productDesc, String term) {
        double count = 0;
        for (String word : productDesc) {
            if (word.equalsIgnoreCase(term)) {
                count++;
            }
        }
        return count / productDesc.length;
    }

    private double computeIDF(List<String[]> productDescriptions, String term) {
        double count = 0;
        for (String[] desc : productDescriptions) {
            if (Arrays.asList(desc).contains(term)) {
                count++;
            }
        }
        return Math.log((double) productDescriptions.size() / (1 + count));
    }

    private Product convertJsonToProduct(String productJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(productJson, Product.class);
        } catch (IOException e) {
            throw new RuntimeException("Error converting JSON to Product", e);
        }
    }
}
