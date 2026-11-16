package com.smartfarmer.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_price_listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerPriceListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false, length = 100)
    private String cropName;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal proposedPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal predictedMarketPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal recommendedMinPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal recommendedMaxPrice;

    @Column(nullable = false, length = 30)
    private String pricingStatus; // UNDERPRICED, FAIR_MARKET, OVERPRICED

    @Column(precision = 5, scale = 2)
    private BigDecimal priceDifferencePct;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
