package com.smartfarmer.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    private LocalDate physicalVisitDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean landRecordsVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean cropCultivationVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean identityProofVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean genuineFarmerConfirmed = false;

    @Column(length = 500)
    private String photoEvidenceUrl;

    @Column(length = 100)
    private String gpsCoordinatesVerified;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String agentRemarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
