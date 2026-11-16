package com.smartfarmer.marketplace.repository;

import com.smartfarmer.marketplace.entity.Admin;
import com.smartfarmer.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUser(User user);
    Optional<Admin> findByUserId(Long userId);
}
