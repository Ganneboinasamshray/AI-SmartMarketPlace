package com.smartfarmer.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(nullable = false, length = 100)
    private String cropName;

    @Column(length = 100)
    private String variety;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityKg;

    @Column(nullable = false, precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal minOrderKg = BigDecimal.valueOf(5.0);

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal pricePerKg;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String qualityGrade = "Grade A";

    @Column(nullable = false)
    private LocalDate harvestDate;

    @Builder.Default
    private Integer shelfLifeDays = 7;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isOrganic = false;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 200)
    private String farmLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProductStatus status = ProductStatus.PENDING_APPROVAL;

    @Column(length = 500)
    private String agentRemarks;

    @Column(length = 150)
    private String verifiedByAgent;

    private LocalDateTime verifiedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum ProductStatus {
        PENDING_APPROVAL,
        APPROVED,
        REJECTED,
        REQUIRES_CHANGES,
        AVAILABLE,
        LOW_STOCK,
        OUT_OF_STOCK,
        DELISTED
    }

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = ProductStatus.PENDING_APPROVAL;
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
