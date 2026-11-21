package com.smartfarmer.marketplace;

import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final AgentRepository agentRepository;
    private final AdminRepository adminRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final FarmerPriceListingRepository priceListingRepository;
    private final HistoricalMarketPriceRepository historicalRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data seed.");
            return;
        }

        log.info("Seeding initial agricultural data, users, and roles...");

        // 1. Categories
        ProductCategory veg = categoryRepository.save(ProductCategory.builder()
                .name("Vegetables")
                .slug("vegetables")
                .description("Fresh daily farm harvest vegetables direct from field")
                .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600")
                .build());

        ProductCategory fruits = categoryRepository.save(ProductCategory.builder()
                .name("Fruits")
                .slug("fruits")
                .description("Naturally ripened orchard fresh seasonal fruits")
                .imageUrl("https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600")
                .build());

        ProductCategory grains = categoryRepository.save(ProductCategory.builder()
                .name("Grains & Cereals")
                .slug("grains")
                .description("Farm-milled unpolished grains, wheat, and pulses")
                .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600")
                .build());

        // 2. Admin User
        User adminUser = userRepository.save(User.builder()
                .email("admin@smartfarmer.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .fullName("Rajesh Sharma (Admin)")
                .phoneNumber("+919876543210")
                .role(User.Role.ROLE_ADMIN)
                .build());

        adminRepository.save(Admin.builder()
                .user(adminUser)
                .department("Marketplace Operations & Compliance")
                .accessLevel("SUPER_ADMIN")
                .build());

        // 3. Field Verification Agent
        User agentUser = userRepository.save(User.builder()
                .email("vikram.agent@smartfarmer.com")
                .passwordHash(passwordEncoder.encode("Agent@123"))
                .fullName("Vikram Rathore (Field Agent)")
                .phoneNumber("+919811122233")
                .role(User.Role.ROLE_AGENT)
                .build());

        Agent agent = agentRepository.save(Agent.builder()
                .user(agentUser)
                .badgeNumber("AGT-NCR-101")
                .assignedRegion("North Zone (Delhi/NCR)")
                .totalVerifications(48)
                .rating(BigDecimal.valueOf(4.9))
                .build());

        // 4. Genuine Verified Farmer
        User farmerUser1 = userRepository.save(User.builder()
                .email("ramesh.farmer@smartfarmer.com")
                .passwordHash(passwordEncoder.encode("Farmer@123"))
                .fullName("Ramesh Patel (Verified Farmer)")
                .phoneNumber("+919733344455")
                .role(User.Role.ROLE_FARMER)
                .build());

        Farmer verifiedFarmer = farmerRepository.save(Farmer.builder()
                .user(farmerUser1)
                .farmName("Green Valley Organic Agro")
                .farmLocation("Shamirpet, Medchal-Malkajgiri, Telangana")
                .latitude(BigDecimal.valueOf(13.1367))
                .longitude(BigDecimal.valueOf(78.1291))
                .farmSizeAcres(BigDecimal.valueOf(8.5))
                .primaryCrops("Tomato, Potato, Carrot")
                .kisanCreditCardNo("KCC-KA-88912")
                .verificationStatus(Farmer.VerificationStatus.APPROVED)
                .assignedAgentId(agent.getId())
                .build());

        // 5. Pending Farmer Needing Verification
        User farmerUser2 = userRepository.save(User.builder()
                .email("suresh.farmer@smartfarmer.com")
                .passwordHash(passwordEncoder.encode("Farmer@123"))
                .fullName("Suresh Yadav (Pending Farmer)")
                .phoneNumber("+919744455566")
                .role(User.Role.ROLE_FARMER)
                .build());

        farmerRepository.save(Farmer.builder()
                .user(farmerUser2)
                .farmName("Yadav Family Farms")
                .farmLocation("Sonipat, Haryana")
                .latitude(BigDecimal.valueOf(28.9931))
                .longitude(BigDecimal.valueOf(77.0151))
                .farmSizeAcres(BigDecimal.valueOf(12.0))
                .primaryCrops("Cauliflower, Cabbage, Green Chilli")
                .kisanCreditCardNo("KCC-HR-55102")
                .verificationStatus(Farmer.VerificationStatus.ASSIGNED)
                .assignedAgentId(agent.getId())
                .build());

        // 6. Wholesale Buyer
        userRepository.save(User.builder()
                .email("priya.buyer@smartfarmer.com")
                .passwordHash(passwordEncoder.encode("Buyer@123"))
                .fullName("Priya Sundaram (Wholesale Buyer)")
                .phoneNumber("+919866677788")
                .role(User.Role.ROLE_BUYER)
                .build());

        // 7. Seed Products for Verified Farmer
        Product tomato = productRepository.save(Product.builder()
                .farmer(verifiedFarmer)
                .category(veg)
                .cropName("Tomato")
                .variety("Hybrid Roma Red")
                .quantityKg(BigDecimal.valueOf(2400.0))
                .minOrderKg(BigDecimal.valueOf(20.0))
                .pricePerKg(BigDecimal.valueOf(28.00))
                .qualityGrade("Grade A")
                .harvestDate(LocalDate.now().minusDays(2))
                .shelfLifeDays(7)
                .isOrganic(true)
                .imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600")
                .farmLocation("Shamirpet, Medchal-Malkajgiri, Telangana")
                .status(Product.ProductStatus.APPROVED)
                .verifiedByAgent("Vikram Rathore (AGT-TS-042)")
                .build());

        Product potato = productRepository.save(Product.builder()
                .farmer(verifiedFarmer)
                .category(veg)
                .cropName("Potato")
                .variety("Jyoti Golden")
                .quantityKg(BigDecimal.valueOf(5000.0))
                .minOrderKg(BigDecimal.valueOf(50.0))
                .pricePerKg(BigDecimal.valueOf(21.00))
                .qualityGrade("Grade A")
                .harvestDate(LocalDate.now().minusDays(5))
                .shelfLifeDays(45)
                .isOrganic(false)
                .imageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600")
                .farmLocation("Shamirpet, Medchal-Malkajgiri, Telangana")
                .status(Product.ProductStatus.APPROVED)
                .verifiedByAgent("Vikram Rathore (AGT-TS-042)")
                .build());

        Product carrot = productRepository.save(Product.builder()
                .farmer(verifiedFarmer)
                .category(veg)
                .cropName("Carrot")
                .variety("Ooty Sweet Red")
                .quantityKg(BigDecimal.valueOf(1200.0))
                .minOrderKg(BigDecimal.valueOf(15.0))
                .pricePerKg(BigDecimal.valueOf(32.00))
                .qualityGrade("Grade A")
                .harvestDate(LocalDate.now().minusDays(1))
                .shelfLifeDays(14)
                .isOrganic(true)
                .imageUrl("https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=600")
                .farmLocation("Shamirpet, Medchal-Malkajgiri, Telangana")
                .status(Product.ProductStatus.APPROVED)
                .verifiedByAgent("Vikram Rathore (AGT-TS-042)")
                .build());

        // 8. Historical Baseline Data Points
        LocalDate today = LocalDate.now();
        for (int i = 30; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            historicalRepository.save(HistoricalMarketPrice.builder()
                    .commodity("Tomato")
                    .category("Vegetables")
                    .market("Azadpur (Delhi)")
                    .region("North")
                    .modalPrice(BigDecimal.valueOf(26.5 + Math.sin(i * 0.2) * 2.5))
                    .minPrice(BigDecimal.valueOf(24.0))
                    .maxPrice(BigDecimal.valueOf(30.0))
                    .arrivalQuintals(BigDecimal.valueOf(1800.0))
                    .priceDate(d)
                    .build());
        }

        log.info("Database initialization completed successfully.");
    }
}
