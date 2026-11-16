package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Order;
import com.smartfarmer.marketplace.entity.User;
import com.smartfarmer.marketplace.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<Order> findByFarmer(Farmer farmer);
    List<Order> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Order> findByOrderStatus(Order.OrderStatus status);
}
