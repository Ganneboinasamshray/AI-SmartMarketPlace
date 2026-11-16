package com.smartfarmer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FarmerDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FarmerProfileRequest {
        @NotBlank
        private String farmName;

        @NotBlank
        private String farmLocation;

        private BigDecimal latitude;
        private BigDecimal longitude;

        @NotNull
        private BigDecimal farmSizeAcres;

        @NotBlank
        private String primaryCrops;

        private String kisanCreditCardNo;
        private String aadhaarNumber;
        private String landDocumentUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FarmerProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String farmName;
        private String farmLocation;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private BigDecimal farmSizeAcres;
        private String primaryCrops;
        private String kisanCreditCardNo;
        private String verificationStatus;
        private Long assignedAgentId;
        private String assignedAgentName;
        private LocalDateTime createdAt;
    }
}
