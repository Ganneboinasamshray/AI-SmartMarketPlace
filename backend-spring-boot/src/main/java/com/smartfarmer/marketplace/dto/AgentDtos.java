package com.smartfarmer.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AgentDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationDecisionRequest {
        @NotNull
        private Long farmerId;

        private LocalDate physicalVisitDate;

        @Builder.Default
        private Boolean landRecordsVerified = true;

        @Builder.Default
        private Boolean cropCultivationVerified = true;

        @Builder.Default
        private Boolean identityProofVerified = true;

        @Builder.Default
        private Boolean genuineFarmerConfirmed = true;

        private String photoEvidenceUrl;
        private String gpsCoordinatesVerified;

        @NotNull
        private String decision; // APPROVED or REJECTED

        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AgentAssignmentRequest {
        @NotNull
        private Long farmerId;

        @NotNull
        private Long agentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PendingVerificationItem {
        private Long farmerId;
        private String farmerName;
        private String phoneNumber;
        private String farmName;
        private String farmLocation;
        private Double farmSizeAcres;
        private String primaryCrops;
        private String landDocumentUrl;
        private String status;
        private LocalDateTime registeredAt;
    }
}
