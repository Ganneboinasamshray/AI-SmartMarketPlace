package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Agent;
import com.smartfarmer.marketplace.entity.AgentAssignment;
import com.smartfarmer.marketplace.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentAssignmentRepository extends JpaRepository<AgentAssignment, Long> {
    List<AgentAssignment> findByAgent(Agent agent);
    List<AgentAssignment> findByAgentId(Long agentId);
    List<AgentAssignment> findByFarmer(Farmer farmer);
    Optional<AgentAssignment> findTopByFarmerOrderByAssignedAtDesc(Farmer farmer);
    List<AgentAssignment> findByStatus(AgentAssignment.AssignmentStatus status);
}
