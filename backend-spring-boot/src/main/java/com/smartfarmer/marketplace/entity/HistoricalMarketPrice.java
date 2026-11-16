package com.smartfarmer.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "historical_market_prices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalMarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 100)
    private String market;

    @Column(nullable = false, length = 50)
    private String region;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal modalPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal minPrice;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal maxPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal arrivalQuintals;

    @Column(precision = 6, scale = 2)
    private BigDecimal rainfallMm;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperatureC;

    @Column(nullable = false)
    private LocalDate priceDate;
}
