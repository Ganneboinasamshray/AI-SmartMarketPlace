package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Farmer;
import com.smartfarmer.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmer(Farmer farmer);
    List<Product> findByFarmerId(Long farmerId);
    List<Product> findByStatus(Product.ProductStatus status);

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' AND p.verifiedByAgent IS NOT NULL")
    List<Product> findVerifiedAvailableProducts();

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' AND p.verifiedByAgent IS NOT NULL " +
           "AND (:cropName IS NULL OR LOWER(p.cropName) LIKE LOWER(CONCAT('%', :cropName, '%'))) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:isOrganic IS NULL OR p.isOrganic = :isOrganic)")
    List<Product> searchProducts(
        @Param("cropName") String cropName,
        @Param("categoryId") Long categoryId,
        @Param("isOrganic") Boolean isOrganic
    );
}
