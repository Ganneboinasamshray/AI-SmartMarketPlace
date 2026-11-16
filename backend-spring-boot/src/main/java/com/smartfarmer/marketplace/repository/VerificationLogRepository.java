package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Farmer;
import com.smartfarmer.marketplace.entity.VerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VerificationLogRepository extends JpaRepository<VerificationLog, Long> {
    List<VerificationLog> findByFarmerOrderByCreatedAtDesc(Farmer farmer);
    List<VerificationLog> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
