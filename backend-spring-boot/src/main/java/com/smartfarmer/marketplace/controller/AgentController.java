package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.AgentDtos.*;
import com.smartfarmer.marketplace.security.UserPrincipal;
import com.smartfarmer.marketplace.service.AgentVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
@Tag(name = "Agent Portal", description = "Farmer verification queue, on-site inspection visits, document checks, and approvals")
@PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
public class AgentController {

    private final AgentVerificationService verificationService;

    @GetMapping("/pending-verifications")
    @Operation(summary = "View pending farmer verification requests assigned to this agent")
    public ResponseEntity<List<PendingVerificationItem>> getPendingVerifications(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(verificationService.getPendingVerificationsForAgent(user.getId()));
    }

    @PostMapping("/verify")
    @Operation(summary = "Submit physical farm inspection results (Approve farmer or reject middleman)")
    public ResponseEntity<Map<String, String>> submitVerification(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody VerificationDecisionRequest request) {
        verificationService.recordVerificationDecision(user.getId(), request);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Verification decision successfully recorded and audited."
        ));
    }
}
