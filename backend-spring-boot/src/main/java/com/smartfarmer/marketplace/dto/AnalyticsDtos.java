package com.smartfarmer.marketplace.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class AnalyticsDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PriceAnalyticsResponse {
        private String commodity;
        private String market;
        private BigDecimal currentPrice;
        private BigDecimal highestPrice;
        private BigDecimal lowestPrice;
        private BigDecimal averagePrice;
        private String trend;
        private List<PriceDataPoint> history;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PriceDataPoint {
        private LocalDate date;
        private BigDecimal modalPrice;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private BigDecimal arrivalQuintals;
    }
}
