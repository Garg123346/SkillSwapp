package com.skillswap.service;

import com.skillswap.config.JwtTokenProvider;
import com.skillswap.dto.*;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Role;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final MentorService mentorService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       MentorService mentorService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.mentorService = mentorService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCollege(request.getCollege() != null && !request.getCollege().isBlank() ? request.getCollege().trim() : "Indian Institute of Technology, Bombay");
        user.setDepartment(request.getDepartment() != null && !request.getDepartment().isBlank() ? request.getDepartment().trim() : "Computer Science & Engineering");
        user.setStudyYear(request.getStudyYear() != null && !request.getStudyYear().isBlank() ? request.getStudyYear().trim() : "3rd Year");
        user.setBio(request.getBio() != null && !request.getBio().isBlank() ? request.getBio().trim() : "Passionate student eager to exchange skills and collaborate on real-world projects.");
        user.setRole(Role.ROLE_STUDENT);
        user.setCredits(10);
        user.setHourlyCredits(1);
        user.setRating(5.0);
        user.setReviewCount(0);
        user.setSessionCount(0);
        user.setAvailability("Mon, Wed, Fri (After 5 PM)");
        user.setLanguages("English, Hindi");
        user.setFeatured(false);

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());
        UserDto userDto = mentorService.mapToUserDto(savedUser);

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDto userDto = mentorService.mapToUserDto(user);

        return new AuthResponse(token, userDto);
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.skillswap.exception.UnauthorizedException("No authenticated user found in session");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserDto getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();
        return mentorService.mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(UserDto updates) {
        User user = getCurrentAuthenticatedUser();
        if (updates.getName() != null && !updates.getName().isBlank()) user.setName(updates.getName().trim());
        if (updates.getCollege() != null) user.setCollege(updates.getCollege().trim());
        if (updates.getDepartment() != null) user.setDepartment(updates.getDepartment().trim());
        if (updates.getYear() != null) user.setStudyYear(updates.getYear().trim());
        if (updates.getBio() != null) user.setBio(updates.getBio().trim());
        if (updates.getAvailability() != null) user.setAvailability(updates.getAvailability().trim());
        if (updates.getLanguages() != null && !updates.getLanguages().isEmpty()) {
            user.setLanguages(String.join(", ", updates.getLanguages()));
        }

        User saved = userRepository.save(user);
        return mentorService.mapToUserDto(saved);
    }
}
