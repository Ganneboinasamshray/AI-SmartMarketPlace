package com.smartfarmer.marketplace.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrderRequest {
        @NotNull
        private Long farmerId;

        @NotEmpty
        private List<OrderItemDto> items;

        @NotNull
        private String deliveryAddress;

        @NotNull
        private String deliveryCity;

        @NotNull
        private String contactPhone;

        private String specialInstructions;

        private String paymentMethod;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDto {
        @NotNull
        private Long productId;

        @NotNull
        private BigDecimal quantityKg;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderResponse {
        private Long id;
        private Long buyerId;
        private String buyerName;
        private Long farmerId;
        private String farmerName;
        private BigDecimal totalAmount;
        private String deliveryAddress;
        private String deliveryCity;
        private String contactPhone;
        private String orderStatus;
        private String paymentStatus;
        private LocalDateTime createdAt;
        private List<OrderItemDetail> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDetail {
        private Long productId;
        private String cropName;
        private BigDecimal quantityKg;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
