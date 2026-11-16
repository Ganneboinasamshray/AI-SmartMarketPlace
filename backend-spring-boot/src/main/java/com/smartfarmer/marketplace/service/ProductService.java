package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.ProductDtos.*;
import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final FarmerRepository farmerRepository;
    private final FarmerPriceListingRepository priceListingRepository;
    private final MlClientService mlClientService;

    @Transactional
    public ProductResponse createProduct(Long farmerUserId, CreateProductRequest req) {
        Farmer farmer = farmerRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user: " + farmerUserId));

        // Strict verification gate: Only APPROVED farmers can list
        if (farmer.getVerificationStatus() != Farmer.VerificationStatus.APPROVED) {
            throw new RuntimeException("Access Denied: Only physically verified farmers can list produce on the marketplace. Current status: " + farmer.getVerificationStatus());
        }

        ProductCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategoryId()));

        Product product = Product.builder()
                .farmer(farmer)
                .category(category)
                .cropName(req.getCropName())
                .variety(req.getVariety())
                .quantityKg(req.getQuantityKg())
                .minOrderKg(req.getMinOrderKg() != null ? req.getMinOrderKg() : BigDecimal.valueOf(5.0))
                .pricePerKg(req.getPricePerKg())
                .qualityGrade(req.getQualityGrade() != null ? req.getQualityGrade() : "Grade A")
                .harvestDate(req.getHarvestDate())
                .shelfLifeDays(req.getShelfLifeDays() != null ? req.getShelfLifeDays() : 7)
                .isOrganic(req.getIsOrganic() != null ? req.getIsOrganic() : false)
                .imageUrl(req.getImageUrl())
                .farmLocation(req.getFarmLocation() != null ? req.getFarmLocation() : farmer.getFarmLocation())
                .status(Product.ProductStatus.AVAILABLE)
                .build();

        Product saved = productRepository.save(product);

        // Record ML Pricing Audit
        try {
            Map<String, Object> comp = mlClientService.comparePrice(req.getCropName(), "Azadpur (Delhi)", req.getPricePerKg());
            FarmerPriceListing listingAudit = FarmerPriceListing.builder()
                    .product(saved)
                    .farmer(farmer)
                    .cropName(req.getCropName())
                    .proposedPrice(req.getPricePerKg())
                    .predictedMarketPrice(BigDecimal.valueOf(((Number) comp.getOrDefault("recommended_min_price", 30)).doubleValue()))
                    .recommendedMinPrice(BigDecimal.valueOf(((Number) comp.getOrDefault("recommended_min_price", 28)).doubleValue()))
                    .recommendedMaxPrice(BigDecimal.valueOf(((Number) comp.getOrDefault("recommended_max_price", 34)).doubleValue()))
                    .pricingStatus((String) comp.getOrDefault("status", "FAIR_MARKET"))
                    .build();
            priceListingRepository.save(listingAudit);
        } catch (Exception ignored) {}

        return mapToResponse(saved);
    }

    public List<ProductResponse> getFarmerProducts(Long farmerUserId) {
        Farmer farmer = farmerRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user: " + farmerUserId));

        return productRepository.findByFarmer(farmer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchMarketplace(String cropName, Long categoryId, Boolean isOrganic) {
        return productRepository.searchProducts(cropName, categoryId, isOrganic).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToResponse(p);
    }

    private ProductResponse mapToResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .farmerId(p.getFarmer().getId())
                .farmerName(p.getFarmer().getUser().getFullName())
                .farmLocation(p.getFarmLocation())
                .categoryName(p.getCategory().getName())
                .cropName(p.getCropName())
                .variety(p.getVariety())
                .quantityKg(p.getQuantityKg())
                .minOrderKg(p.getMinOrderKg())
                .pricePerKg(p.getPricePerKg())
                .qualityGrade(p.getQualityGrade())
                .harvestDate(p.getHarvestDate())
                .shelfLifeDays(p.getShelfLifeDays())
                .isOrganic(p.getIsOrganic())
                .imageUrl(p.getImageUrl())
                .status(p.getStatus().name())
                .farmerVerified(p.getFarmer().getVerificationStatus() == Farmer.VerificationStatus.APPROVED)
                .farmerPhone(p.getFarmer().getUser().getPhoneNumber())
                .build();
    }
}
