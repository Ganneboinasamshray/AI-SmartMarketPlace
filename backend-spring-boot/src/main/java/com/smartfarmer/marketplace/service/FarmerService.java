package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.FarmerDtos.*;
import com.smartfarmer.marketplace.entity.Farmer;
import com.smartfarmer.marketplace.entity.User;
import com.smartfarmer.marketplace.repository.AgentRepository;
import com.smartfarmer.marketplace.repository.FarmerRepository;
import com.smartfarmer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final AgentRepository agentRepository;

    public FarmerProfileResponse getProfileByUserId(Long userId) {
        Farmer farmer = farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        String agentName = "Unassigned";
        if (farmer.getAssignedAgentId() != null) {
            agentName = agentRepository.findById(farmer.getAssignedAgentId())
                    .map(a -> a.getUser().getFullName() + " (" + a.getBadgeNumber() + ")")
                    .orElse("Assigned");
        }

        return FarmerProfileResponse.builder()
                .id(farmer.getId())
                .userId(farmer.getUser().getId())
                .fullName(farmer.getUser().getFullName())
                .email(farmer.getUser().getEmail())
                .phoneNumber(farmer.getUser().getPhoneNumber())
                .farmName(farmer.getFarmName())
                .farmLocation(farmer.getFarmLocation())
                .latitude(farmer.getLatitude())
                .longitude(farmer.getLongitude())
                .farmSizeAcres(farmer.getFarmSizeAcres())
                .primaryCrops(farmer.getPrimaryCrops())
                .kisanCreditCardNo(farmer.getKisanCreditCardNo())
                .verificationStatus(farmer.getVerificationStatus().name())
                .assignedAgentId(farmer.getAssignedAgentId())
                .assignedAgentName(agentName)
                .createdAt(farmer.getCreatedAt())
                .build();
    }

    @Transactional
    public FarmerProfileResponse updateProfile(Long userId, FarmerProfileRequest req) {
        Farmer farmer = farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user ID: " + userId));

        farmer.setFarmName(req.getFarmName());
        farmer.setFarmLocation(req.getFarmLocation());
        farmer.setLatitude(req.getLatitude());
        farmer.setLongitude(req.getLongitude());
        farmer.setFarmSizeAcres(req.getFarmSizeAcres());
        farmer.setPrimaryCrops(req.getPrimaryCrops());
        farmer.setKisanCreditCardNo(req.getKisanCreditCardNo());
        if (req.getLandDocumentUrl() != null) {
            farmer.setLandDocumentUrl(req.getLandDocumentUrl());
        }

        // Keep or reset to PENDING if documents are updated
        if (farmer.getVerificationStatus() == Farmer.VerificationStatus.REJECTED) {
            farmer.setVerificationStatus(Farmer.VerificationStatus.PENDING);
        }

        Farmer saved = farmerRepository.save(farmer);
        return getProfileByUserId(userId);
    }
}
