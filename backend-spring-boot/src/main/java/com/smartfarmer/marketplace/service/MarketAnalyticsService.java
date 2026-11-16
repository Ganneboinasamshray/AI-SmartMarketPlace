package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.AnalyticsDtos.*;
import com.smartfarmer.marketplace.entity.HistoricalMarketPrice;
import com.smartfarmer.marketplace.repository.HistoricalMarketPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketAnalyticsService {

    private final HistoricalMarketPriceRepository historicalRepository;
    private final MlClientService mlClientService;

    public PriceAnalyticsResponse getAnalytics(String commodity, String market, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        List<HistoricalMarketPrice> list = historicalRepository.findHistory(commodity, market, startDate, endDate);

        if (list.isEmpty()) {
            list = historicalRepository.findByCommodityOrderByPriceDateAsc(commodity);
            if (list.size() > days) {
                list = list.subList(list.size() - days, list.size());
            }
        }

        BigDecimal highest = BigDecimal.ZERO;
        BigDecimal lowest = BigDecimal.valueOf(999999);
        BigDecimal sum = BigDecimal.ZERO;

        List<PriceDataPoint> points = new ArrayList<>();
        for (HistoricalMarketPrice h : list) {
            if (h.getModalPrice().compareTo(highest) > 0) highest = h.getModalPrice();
            if (h.getModalPrice().compareTo(lowest) < 0) lowest = h.getModalPrice();
            sum = sum.add(h.getModalPrice());

            points.add(PriceDataPoint.builder()
                    .date(h.getPriceDate())
                    .modalPrice(h.getModalPrice())
                    .minPrice(h.getMinPrice())
                    .maxPrice(h.getMaxPrice())
                    .arrivalQuintals(h.getArrivalQuintals())
                    .build());
        }

        BigDecimal avg = list.isEmpty() ? BigDecimal.ZERO : sum.divide(BigDecimal.valueOf(list.size()), 2, RoundingMode.HALF_UP);
        BigDecimal current = list.isEmpty() ? BigDecimal.ZERO : list.get(list.size() - 1).getModalPrice();

        // Check ML prediction for trend
        Map<String, Object> pred = mlClientService.predictPrice(commodity, market != null ? market : "Azadpur (Delhi)", 7);
        String trend = (String) pred.getOrDefault("trend", "Stable");

        return PriceAnalyticsResponse.builder()
                .commodity(commodity)
                .market(market != null ? market : "Consolidated Mandis")
                .currentPrice(current)
                .highestPrice(highest)
                .lowestPrice(lowest.compareTo(BigDecimal.valueOf(999999)) == 0 ? BigDecimal.ZERO : lowest)
                .averagePrice(avg)
                .trend(trend)
                .history(points)
                .build();
    }
}
