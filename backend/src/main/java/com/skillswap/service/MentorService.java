package com.skillswap.service;

import com.skillswap.dto.ReviewDto;
import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserDto;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.*;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MentorService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final ReviewRepository reviewRepository;

    public MentorService(UserRepository userRepository,
                         UserSkillRepository userSkillRepository,
                         ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getMentors(String categoryStr, String levelStr, String sort, String query) {
        List<User> users;
        if (query != null && !query.trim().isEmpty()) {
            users = userRepository.searchMentors(query.trim());
        } else {
            users = userRepository.findAll();
        }

        SkillCategory filterCategory = null;
        if (categoryStr != null && !categoryStr.trim().isEmpty() && !categoryStr.equalsIgnoreCase("Tous")) {
            try {
                filterCategory = SkillCategory.fromString(categoryStr.trim());
            } catch (Exception ignored) {}
        }

        ProficiencyLevel filterLevel = null;
        if (levelStr != null && !levelStr.trim().isEmpty() && !levelStr.equalsIgnoreCase("Tous")) {
            try {
                filterLevel = ProficiencyLevel.fromString(levelStr.trim());
            } catch (Exception ignored) {}
        }

        final SkillCategory catFinal = filterCategory;
        final ProficiencyLevel lvlFinal = filterLevel;

        List<UserDto> dtos = users.stream()
                .map(this::mapToUserDto)
                .filter(dto -> {
                    if (catFinal != null) {
                        boolean matches = dto.getTeaches().stream().anyMatch(s -> s.getCategory() == catFinal);
                        if (!matches) return false;
                    }
                    if (lvlFinal != null) {
                        boolean matches = dto.getTeaches().stream().anyMatch(s -> s.getLevel() == lvlFinal);
                        if (!matches) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // Sort
        if ("note".equalsIgnoreCase(sort) || "rating".equalsIgnoreCase(sort)) {
            dtos.sort((a, b) -> Double.compare(b.getRating(), a.getRating()));
        } else if ("nom".equalsIgnoreCase(sort) || "name".equalsIgnoreCase(sort)) {
            dtos.sort(Comparator.comparing(UserDto::getName));
        } else if ("disponibilite".equalsIgnoreCase(sort) || "availability".equalsIgnoreCase(sort)) {
            dtos.sort(Comparator.comparing(UserDto::getAvailability));
        } else {
            // Default: featured first, then rating
            dtos.sort((a, b) -> {
                int f = Boolean.compare(b.getFeatured() != null && b.getFeatured(), a.getFeatured() != null && a.getFeatured());
                if (f != 0) return f;
                return Double.compare(b.getRating(), a.getRating());
            });
        }

        return dtos;
    }

    @Transactional(readOnly = true)
    public UserDto getMentorById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with ID: " + id));
        return mapToUserDto(user);
    }

    public UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(String.valueOf(user.getId()));
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCollege(user.getCollege());
        dto.setDepartment(user.getDepartment());
        dto.setYear(user.getStudyYear() != null ? user.getStudyYear() : "3rd Year");
        dto.setTitle(user.getDepartment() != null ? user.getDepartment() + " Student" : "Student Mentor");
        dto.setCity(user.getCollege() != null ? user.getCollege() : "Campus");
        dto.setRole(user.getRole());
        dto.setBio(user.getBio());
        dto.setAvatarInitials(user.getAvatarInitials());
        dto.setCredits(user.getCredits());
        dto.setHourlyCredits(user.getHourlyCredits());
        dto.setRating(user.getRating());
        dto.setReviewCount(user.getReviewCount());
        dto.setSessionCount(user.getSessionCount());
        dto.setAvailability(user.getAvailability());
        dto.setFeatured(user.getFeatured());

        if (user.getCreatedAt() != null) {
            dto.setJoinedAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH)));
        }

        if (user.getLanguages() != null && !user.getLanguages().isBlank()) {
            dto.setLanguages(Arrays.stream(user.getLanguages().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setLanguages(List.of("English"));
        }

        // Skills
        List<UserSkill> userSkills = userSkillRepository.findByUserId(user.getId());
        List<SkillDto> offered = new ArrayList<>();
        List<SkillDto> wanted = new ArrayList<>();

        for (UserSkill us : userSkills) {
            Skill s = us.getSkill();
            SkillDto sDto = new SkillDto(
                    String.valueOf(s.getId()),
                    s.getName(),
                    s.getCategory(),
                    us.getCustomDescription() != null && !us.getCustomDescription().isBlank() ? us.getCustomDescription() : s.getDescription(),
                    us.getProficiencyLevel() != null ? us.getProficiencyLevel() : s.getLevel()
            );
            if (us.getSkillType() == SkillType.OFFERED) {
                offered.add(sDto);
            } else {
                wanted.add(sDto);
            }
        }
        dto.setTeaches(offered);
        dto.setWantsToLearn(wanted);

        // Reviews
        List<Review> reviews = reviewRepository.findByMentorIdOrderByCreatedAtDesc(user.getId());
        List<ReviewDto> reviewDtos = reviews.stream().map(r -> new ReviewDto(
                String.valueOf(r.getId()),
                r.getReviewer().getName(),
                r.getReviewer().getCollege() != null ? r.getReviewer().getCollege() : "University",
                r.getReviewer().getAvatarInitials(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt().format(DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH))
        )).collect(Collectors.toList());

        dto.setReviews(reviewDtos);

        return dto;
    }
}
