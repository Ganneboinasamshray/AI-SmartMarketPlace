package com.smartfarmer.marketplace.service;

import com.smartfarmer.marketplace.dto.AuthDtos.*;
import com.smartfarmer.marketplace.entity.*;
import com.smartfarmer.marketplace.repository.*;
import com.smartfarmer.marketplace.security.JwtUtils;
import com.smartfarmer.marketplace.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        String verificationStatus = null;

        if ("ROLE_FARMER".equals(userDetails.getRole())) {
            verificationStatus = farmerRepository.findByUserId(userDetails.getId())
                    .map(f -> f.getVerificationStatus().name())
                    .orElse("NOT_REGISTERED");
        }

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .verificationStatus(verificationStatus)
                .build();
    }

    @Transactional
    public JwtResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new RuntimeException("Error: Phone number is already registered!");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(registerRequest.getRole())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Pre-create initial profile for farmers
        if (savedUser.getRole() == User.Role.ROLE_FARMER) {
            Farmer farmer = Farmer.builder()
                    .user(savedUser)
                    .farmName(savedUser.getFullName() + "'s Farm")
                    .farmLocation("Pending Location Details")
                    .farmSizeAcres(BigDecimal.ZERO)
                    .primaryCrops("Pending")
                    .verificationStatus(Farmer.VerificationStatus.PENDING)
                    .build();
            farmerRepository.save(farmer);
        }

        // Auto authenticate on registration
        LoginRequest login = new LoginRequest(registerRequest.getEmail(), registerRequest.getPassword());
        return authenticateUser(login);
    }
}
