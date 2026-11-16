package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.OrderItem;
import com.smartfarmer.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
}
