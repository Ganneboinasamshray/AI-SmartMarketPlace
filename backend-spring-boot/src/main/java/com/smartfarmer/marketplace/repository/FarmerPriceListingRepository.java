package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.FarmerPriceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FarmerPriceListingRepository extends JpaRepository<FarmerPriceListing, Long> {
    List<FarmerPriceListing> findByFarmerId(Long farmerId);
    List<FarmerPriceListing> findByCropName(String cropName);
}
