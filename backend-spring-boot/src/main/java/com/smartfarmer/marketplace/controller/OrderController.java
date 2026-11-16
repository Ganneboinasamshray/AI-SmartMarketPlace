package com.smartfarmer.marketplace.controller;

import com.smartfarmer.marketplace.dto.OrderDtos.*;
import com.smartfarmer.marketplace.security.UserPrincipal;
import com.smartfarmer.marketplace.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders Management", description = "Buyer checkout, order placement, and tracking")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new produce order directly with farmer")
    public ResponseEntity<OrderResponse> placeOrder(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(user.getId(), request));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "List all orders placed by the current buyer")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(orderService.getBuyerOrders(user.getId()));
    }
}
