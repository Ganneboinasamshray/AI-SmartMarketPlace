package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.AnalyticsDtos.PriceAnalyticsResponse;
import com.smartfarmer.marketplace.service.MarketAnalyticsService;
import com.smartfarmer.marketplace.service.MlClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Market Analytics & Price Forecasting", description = "Historical mandi price trends and ML forward projections")
public class AnalyticsController {

    private final MarketAnalyticsService analyticsService;
    private final MlClientService mlClientService;

    @GetMapping("/price-trends")
    @Operation(summary = "Get historical prices, min, max, average and trend for a crop")
    public ResponseEntity<PriceAnalyticsResponse> getPriceTrends(
            @RequestParam String commodity,
            @RequestParam(required = false) String market,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getAnalytics(commodity, market, days));
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get 7-day or 30-day machine learning price predictions with confidence intervals")
    public ResponseEntity<Map<String, Object>> getForecast(
            @RequestParam String commodity,
            @RequestParam(defaultValue = "Azadpur (Delhi)") String market,
            @RequestParam(defaultValue = "7") int forecastDays) {
        return ResponseEntity.ok(mlClientService.predictPrice(commodity, market, forecastDays));
    }
}
