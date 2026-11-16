package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.FarmerDtos.*;
import com.smartfarmer.marketplace.dto.OrderDtos.OrderResponse;
import com.smartfarmer.marketplace.dto.ProductDtos.*;
import com.smartfarmer.marketplace.entity.Order;
import com.smartfarmer.marketplace.security.UserPrincipal;
import com.smartfarmer.marketplace.service.FarmerService;
import com.smartfarmer.marketplace.service.MlClientService;
import com.smartfarmer.marketplace.service.OrderService;
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
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
@Tag(name = "Farmer Portal", description = "Farmer profile management, document uploads, product listings, ML price advisor, and orders")
@PreAuthorize("hasAnyAuthority('ROLE_FARMER', 'ROLE_ADMIN')")
public class FarmerController {

    private final FarmerService farmerService;
    private final ProductService productService;
    private final OrderService orderService;
    private final MlClientService mlClientService;

    @GetMapping("/profile")
    @Operation(summary = "Get current farmer profile and verification status")
    public ResponseEntity<FarmerProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(farmerService.getProfileByUserId(user.getId()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Submit/update farm details, land ownership proofs, and crops")
    public ResponseEntity<FarmerProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody FarmerProfileRequest request) {
        return ResponseEntity.ok(farmerService.updateProfile(user.getId(), request));
    }

    @PostMapping("/products")
    @Operation(summary = "Publish fresh produce for sale (requires APPROVED verification)")
    public ResponseEntity<ProductResponse> createProduct(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(user.getId(), request));
    }

    @GetMapping("/products")
    @Operation(summary = "List all crops and produce listed by this farmer")
    public ResponseEntity<List<ProductResponse>> getMyProducts(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(productService.getFarmerProducts(user.getId()));
    }

    @PostMapping("/consult-price")
    @Operation(summary = "Consult ML model for recommended price bracket and market trend")
    public ResponseEntity<Map<String, Object>> consultPrice(
            @Valid @RequestBody PriceConsultationRequest request) {
        return ResponseEntity.ok(mlClientService.comparePrice(request.getCommodity(), request.getMarket(), request.getProposedPrice()));
    }

    @GetMapping("/orders")
    @Operation(summary = "List incoming customer purchase orders")
    public ResponseEntity<List<OrderResponse>> getOrders(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(orderService.getFarmerOrders(user.getId()));
    }

    @PatchMapping("/orders/{orderId}/status")
    @Operation(summary = "Update order status (CONFIRMED, DISPATCHED, DELIVERED)")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long orderId,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(user.getId(), orderId, status));
    }
}
