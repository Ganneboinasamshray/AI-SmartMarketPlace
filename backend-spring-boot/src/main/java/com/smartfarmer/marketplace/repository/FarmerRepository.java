package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Farmer;
import com.smartfarmer.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByUser(User user);
    Optional<Farmer> findByUserId(Long userId);
    List<Farmer> findByVerificationStatus(Farmer.VerificationStatus status);
    List<Farmer> findByAssignedAgentId(Long agentId);
}
