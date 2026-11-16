package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.AgentDtos.AgentAssignmentRequest;
import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Portal", description = "Platform management, agent assignment, user moderation, and audit logs")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final AgentRepository agentRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AgentAssignmentRepository assignmentRepository;
    private final VerificationLogRepository verificationLogRepository;

    @GetMapping("/overview")
    @Operation(summary = "Get platform KPI metrics and system summary")
    public ResponseEntity<Map<String, Object>> getOverview() {
        long totalUsers = userRepository.count();
        long totalFarmers = farmerRepository.count();
        long approvedFarmers = farmerRepository.findByVerificationStatus(Farmer.VerificationStatus.APPROVED).size();
        long pendingFarmers = farmerRepository.findByVerificationStatus(Farmer.VerificationStatus.PENDING).size();
        long totalAgents = agentRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        BigDecimal gmv = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalFarmers", totalFarmers);
        stats.put("approvedFarmers", approvedFarmers);
        stats.put("pendingFarmers", pendingFarmers);
        stats.put("verificationRatePct", totalFarmers > 0 ? (approvedFarmers * 100.0 / totalFarmers) : 0);
        stats.put("totalAgents", totalAgents);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("grossMerchandiseValue", gmv);

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/assign-agent")
    @Operation(summary = "Assign a verification agent to an unverified farmer")
    public ResponseEntity<Map<String, String>> assignAgent(@Valid @RequestBody AgentAssignmentRequest req) {
        Farmer farmer = farmerRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + req.getFarmerId()));

        Agent agent = agentRepository.findById(req.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found: " + req.getAgentId()));

        farmer.setAssignedAgentId(agent.getId());
        farmer.setVerificationStatus(Farmer.VerificationStatus.ASSIGNED);
        farmerRepository.save(farmer);

        AgentAssignment assignment = AgentAssignment.builder()
                .agent(agent)
                .farmer(farmer)
                .status(AgentAssignment.AssignmentStatus.ASSIGNED)
                .build();
        assignmentRepository.save(assignment);

        VerificationLog log = VerificationLog.builder()
                .farmer(farmer)
                .performedBy(agent.getUser())
                .action("ASSIGNED")
                .notes("Assigned to Agent " + agent.getUser().getFullName() + " for physical inspection.")
                .build();
        verificationLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Agent successfully assigned to farmer."));
    }

    @GetMapping("/verification-logs")
    @Operation(summary = "View system verification audit logs")
    public ResponseEntity<List<VerificationLog>> getLogs() {
        return ResponseEntity.ok(verificationLogRepository.findAll());
    }
}
