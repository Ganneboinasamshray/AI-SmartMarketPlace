package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Payment;
import com.smartfarmer.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Order order);
    Optional<Payment> findByTransactionReference(String transactionReference);
}
