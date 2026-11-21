package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.OrderDtos.*;
import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public OrderResponse createOrder(Long buyerUserId, CreateOrderRequest req) {
        User buyer = userRepository.findById(buyerUserId)
                .orElseThrow(() -> new RuntimeException("Buyer not found with id: " + buyerUserId));

        Farmer farmer = farmerRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + req.getFarmerId()));

        Order order = Order.builder()
                .buyer(buyer)
                .farmer(farmer)
                .totalAmount(BigDecimal.ZERO)
                .deliveryAddress(req.getDeliveryAddress())
                .deliveryCity(req.getDeliveryCity())
                .contactPhone(req.getContactPhone())
                .specialInstructions(req.getSpecialInstructions())
                .orderStatus(Order.OrderStatus.PLACED)
                .paymentStatus(Order.PaymentStatus.PAID) // Simulated instant digital payment
                .build();

        BigDecimal runningTotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDto itemDto : req.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

            if (product.getStatus() != Product.ProductStatus.APPROVED || product.getVerifiedByAgent() == null) {
                throw new RuntimeException("Access Denied: Product " + product.getCropName() + " has not been approved by a Field Agent.");
            }

            if (product.getQuantityKg().compareTo(itemDto.getQuantityKg()) < 0) {
                throw new RuntimeException("Insufficient stock for crop: " + product.getCropName() + ". Available: " + product.getQuantityKg());
            }

            // Deduct inventory
            product.setQuantityKg(product.getQuantityKg().subtract(itemDto.getQuantityKg()));
            if (product.getQuantityKg().compareTo(BigDecimal.ZERO) <= 0) {
                product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
            }
            productRepository.save(product);

            BigDecimal subtotal = product.getPricePerKg().multiply(itemDto.getQuantityKg());
            runningTotal = runningTotal.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantityKg(itemDto.getQuantityKg())
                    .unitPrice(product.getPricePerKg())
                    .subtotal(subtotal)
                    .build();
            items.add(orderItem);
        }

        order.setTotalAmount(runningTotal);
        order.setItems(items);
        Order savedOrder = orderRepository.save(order);

        // Record simulated payment
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI")
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .amount(runningTotal)
                .status("COMPLETED")
                .build();
        paymentRepository.save(payment);

        // Notify farmer
        Notification farmerNotice = Notification.builder()
                .user(farmer.getUser())
                .title("New Order #" + savedOrder.getId() + " Received! 📦")
                .message("Buyer " + buyer.getFullName() + " placed an order for ₹" + runningTotal + ". Ready to pack and dispatch.")
                .type("ORDER")
                .build();
        notificationRepository.save(farmerNotice);

        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getBuyerOrders(Long buyerUserId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerUserId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getFarmerOrders(Long farmerUserId) {
        Farmer farmer = farmerRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user: " + farmerUserId));

        return orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long farmerUserId, Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setOrderStatus(newStatus);
        Order saved = orderRepository.save(order);

        // Notify buyer
        Notification buyerNotice = Notification.builder()
                .user(order.getBuyer())
                .title("Order #" + order.getId() + " Status: " + newStatus.name())
                .message("Farmer " + order.getFarmer().getUser().getFullName() + " updated your order status to " + newStatus.name() + ".")
                .type("ORDER_UPDATE")
                .build();
        notificationRepository.save(buyerNotice);

        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemDetail> itemDetails = order.getItems().stream()
                .map(i -> OrderItemDetail.builder()
                        .productId(i.getProduct().getId())
                        .cropName(i.getProduct().getCropName())
                        .quantityKg(i.getQuantityKg())
                        .unitPrice(i.getUnitPrice())
                        .subtotal(i.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getFullName())
                .farmerId(order.getFarmer().getId())
                .farmerName(order.getFarmer().getUser().getFullName())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryCity(order.getDeliveryCity())
                .contactPhone(order.getContactPhone())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .createdAt(order.getCreatedAt())
                .items(itemDetails)
                .build();
    }
}
