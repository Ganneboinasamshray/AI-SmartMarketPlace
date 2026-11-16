package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Farmer;
import com.smartfarmer.marketplace.entity.FarmerVerification;
import com.smartfarmer.marketplace.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerVerificationRepository extends JpaRepository<FarmerVerification, Long> {
    List<FarmerVerification> findByAgent(Agent agent);
    List<FarmerVerification> findByAgentId(Long agentId);
    List<FarmerVerification> findByFarmer(Farmer farmer);
    Optional<FarmerVerification> findTopByFarmerOrderByCreatedAtDesc(Farmer farmer);
    List<FarmerVerification> findByStatus(FarmerVerification.VerificationStatus status);
}
