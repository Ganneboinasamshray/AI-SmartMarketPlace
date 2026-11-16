package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.AgentDtos.*;
import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentVerificationService {

    private final FarmerRepository farmerRepository;
    private final AgentRepository agentRepository;
    private final FarmerVerificationRepository verificationRepository;
    private final VerificationLogRepository verificationLogRepository;
    private final NotificationRepository notificationRepository;

    public List<PendingVerificationItem> getPendingVerificationsForAgent(Long agentUserId) {
        Agent agent = agentRepository.findByUserId(agentUserId)
                .orElseThrow(() -> new RuntimeException("Agent profile not found for user: " + agentUserId));

        List<Farmer> farmers = farmerRepository.findByAssignedAgentId(agent.getId());
        return farmers.stream()
                .filter(f -> f.getVerificationStatus() == Farmer.VerificationStatus.ASSIGNED ||
                             f.getVerificationStatus() == Farmer.VerificationStatus.PENDING)
                .map(f -> PendingVerificationItem.builder()
                        .farmerId(f.getId())
                        .farmerName(f.getUser().getFullName())
                        .phoneNumber(f.getUser().getPhoneNumber())
                        .farmName(f.getFarmName())
                        .farmLocation(f.getFarmLocation())
                        .farmSizeAcres(f.getFarmSizeAcres() != null ? f.getFarmSizeAcres().doubleValue() : 0.0)
                        .primaryCrops(f.getPrimaryCrops())
                        .landDocumentUrl(f.getLandDocumentUrl())
                        .status(f.getVerificationStatus().name())
                        .registeredAt(f.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void recordVerificationDecision(Long agentUserId, VerificationDecisionRequest req) {
        Agent agent = agentRepository.findByUserId(agentUserId)
                .orElseThrow(() -> new RuntimeException("Agent profile not found for user: " + agentUserId));

        Farmer farmer = farmerRepository.findById(req.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found: " + req.getFarmerId()));

        boolean isApproved = "APPROVED".equalsIgnoreCase(req.getDecision());

        FarmerVerification verification = FarmerVerification.builder()
                .farmer(farmer)
                .agent(agent)
                .physicalVisitDate(req.getPhysicalVisitDate() != null ? req.getPhysicalVisitDate() : LocalDate.now())
                .landRecordsVerified(req.getLandRecordsVerified())
                .cropCultivationVerified(req.getCropCultivationVerified())
                .identityProofVerified(req.getIdentityProofVerified())
                .genuineFarmerConfirmed(req.getGenuineFarmerConfirmed() && isApproved)
                .photoEvidenceUrl(req.getPhotoEvidenceUrl())
                .gpsCoordinatesVerified(req.getGpsCoordinatesVerified())
                .status(isApproved ? FarmerVerification.VerificationStatus.APPROVED : FarmerVerification.VerificationStatus.REJECTED)
                .agentRemarks(req.getRemarks())
                .build();

        verificationRepository.save(verification);

        // Update farmer status
        farmer.setVerificationStatus(isApproved ? Farmer.VerificationStatus.APPROVED : Farmer.VerificationStatus.REJECTED);
        farmerRepository.save(farmer);

        // Increment agent stats
        agent.setTotalVerifications(agent.getTotalVerifications() + 1);
        agentRepository.save(agent);

        // Create audit log
        VerificationLog log = VerificationLog.builder()
                .farmer(farmer)
                .performedBy(agent.getUser())
                .action(isApproved ? "APPROVED" : (req.getGenuineFarmerConfirmed() ? "REJECTED" : "FLAGGED_MIDDLEMAN"))
                .notes(req.getRemarks())
                .build();
        verificationLogRepository.save(log);

        // Notify farmer
        Notification notification = Notification.builder()
                .user(farmer.getUser())
                .title(isApproved ? "Farm Verification Approved! 🎉" : "Farm Verification Update")
                .message(isApproved
                        ? "Congratulations! Your farm was verified by Agent " + agent.getUser().getFullName() + ". You can now publish fresh produce directly to buyers."
                        : "Your verification request was rejected. Inspector remarks: " + req.getRemarks())
                .type(isApproved ? "SUCCESS" : "ALERT")
                .build();
        notificationRepository.save(notification);
    }
}
