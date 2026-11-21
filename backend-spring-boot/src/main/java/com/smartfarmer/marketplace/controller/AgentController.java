package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.AgentDtos.*;
import com.smartfarmer.marketplace.dto.ProductDtos.*;
import com.smartfarmer.marketplace.security.UserPrincipal;
import com.smartfarmer.marketplace.service.AgentVerificationService;
import com.smartfarmer.marketplace.service.ProductService;
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
@Tag(name = "Agent Portal", description = "Farmer & product verification queue, inspections, and approvals")
@PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
public class AgentController {

    private final AgentVerificationService verificationService;
    private final ProductService productService;

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

    @GetMapping("/pending-products")
    @Operation(summary = "List all newly submitted vegetable listings awaiting agent approval")
    public ResponseEntity<List<ProductResponse>> getPendingProducts() {
        return ResponseEntity.ok(productService.getPendingApprovalProducts());
    }

    @PostMapping("/products/{productId}/approve")
    @Operation(summary = "Approve a pending product listing to make it visible to buyers")
    public ResponseEntity<ProductResponse> approveProduct(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long productId,
            @RequestBody(required = false) ProductApprovalRequest request) {
        String remarks = (request != null && request.getRemarks() != null) ? request.getRemarks() : "Approved by field agent.";
        return ResponseEntity.ok(productService.approveProduct(productId, user.getEmail(), remarks));
    }

    @PostMapping("/products/{productId}/reject")
    @Operation(summary = "Reject a pending product listing (keeps it hidden from buyers)")
    public ResponseEntity<ProductResponse> rejectProduct(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long productId,
            @RequestBody ProductApprovalRequest request) {
        String reason = (request != null && request.getRemarks() != null) ? request.getRemarks() : "Rejected by field agent.";
        return ResponseEntity.ok(productService.rejectProduct(productId, user.getEmail(), reason));
    }

    @PostMapping("/products/{productId}/request-changes")
    @Operation(summary = "Request modifications on a product listing from the farmer")
    public ResponseEntity<ProductResponse> requestChanges(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long productId,
            @RequestBody ProductApprovalRequest request) {
        String instructions = (request != null && request.getRemarks() != null) ? request.getRemarks() : "Please revise listing details.";
        return ResponseEntity.ok(productService.requestProductChanges(productId, user.getEmail(), instructions));
    }
}
