package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Agent;
import com.smartfarmer.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByUser(User user);
    Optional<Agent> findByUserId(Long userId);
    Optional<Agent> findByBadgeNumber(String badgeNumber);
    List<Agent> findByIsActiveTrue();
    List<Agent> findByAssignedRegion(String region);
}
