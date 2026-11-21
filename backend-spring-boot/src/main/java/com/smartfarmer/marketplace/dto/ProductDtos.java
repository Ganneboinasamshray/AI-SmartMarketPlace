package com.smartfarmer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateProductRequest {
        @NotNull
        private Long categoryId;

        @NotBlank
        private String cropName;

        private String variety;

        @NotNull
        private BigDecimal quantityKg;

        private BigDecimal minOrderKg;

        @NotNull
        private BigDecimal pricePerKg;

        private String qualityGrade;

        @NotNull
        private LocalDate harvestDate;

        private Integer shelfLifeDays;

        private Boolean isOrganic;

        private String imageUrl;

        private String farmLocation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductResponse {
        private Long id;
        private Long farmerId;
        private String farmerName;
        private String farmLocation;
        private String categoryName;
        private String cropName;
        private String variety;
        private BigDecimal quantityKg;
        private BigDecimal minOrderKg;
        private BigDecimal pricePerKg;
        private String qualityGrade;
        private LocalDate harvestDate;
        private Integer shelfLifeDays;
        private Boolean isOrganic;
        private String imageUrl;
        private String status;
        private Boolean agentApproved;
        private String agentRemarks;
        private String verifiedByAgent;
        private Boolean farmerVerified;
        private String farmerPhone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductApprovalRequest {
        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PriceConsultationRequest {
        @NotBlank
        private String commodity;

        @NotBlank
        private String market;

        @NotNull
        private BigDecimal proposedPrice;
    }
}
