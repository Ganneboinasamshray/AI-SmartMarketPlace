package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.HistoricalMarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoricalMarketPriceRepository extends JpaRepository<HistoricalMarketPrice, Long> {
    List<HistoricalMarketPrice> findByCommodityOrderByPriceDateAsc(String commodity);
    
    @Query("SELECT h FROM HistoricalMarketPrice h WHERE h.commodity = :commodity AND (:market IS NULL OR h.market = :market) AND h.priceDate BETWEEN :startDate AND :endDate ORDER BY h.priceDate ASC")
    List<HistoricalMarketPrice> findHistory(
        @Param("commodity") String commodity,
        @Param("market") String market,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
