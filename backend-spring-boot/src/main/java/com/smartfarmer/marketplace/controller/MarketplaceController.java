package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.ProductDtos.ProductResponse;
import com.smartfarmer.marketplace.entity.ProductCategory;
import com.smartfarmer.marketplace.repository.ProductCategoryRepository;
import com.smartfarmer.marketplace.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
@Tag(name = "Marketplace Public Catalog", description = "Public produce catalog, categories, search, and direct farmer contact")
public class MarketplaceController {

    private final ProductService productService;
    private final ProductCategoryRepository categoryRepository;

    @GetMapping("/products")
    @Operation(summary = "Search and filter verified farmer produce")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String cropName,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean isOrganic) {
        return ResponseEntity.ok(productService.searchMarketplace(cropName, categoryId, isOrganic));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get detailed product information with farmer contact")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/categories")
    @Operation(summary = "List all product categories")
    public ResponseEntity<List<ProductCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
