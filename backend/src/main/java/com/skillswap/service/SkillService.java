package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserSkillRequest;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.*;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository,
                        UserSkillRepository userSkillRepository,
                        UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
    }

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(s -> new SkillDto(String.valueOf(s.getId()), s.getName(), s.getCategory(), s.getDescription(), s.getLevel()))
                .collect(Collectors.toList());
    }

    public List<SkillDto> getSkillsByCategory(SkillCategory category) {
        return skillRepository.findByCategory(category).stream()
                .map(s -> new SkillDto(String.valueOf(s.getId()), s.getName(), s.getCategory(), s.getDescription(), s.getLevel()))
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto createSkill(SkillDto dto) {
        Optional<Skill> existing = skillRepository.findByNameIgnoreCase(dto.getName().trim());
        if (existing.isPresent()) {
            Skill s = existing.get();
            return new SkillDto(String.valueOf(s.getId()), s.getName(), s.getCategory(), s.getDescription(), s.getLevel());
        }
        Skill skill = new Skill(
                dto.getName().trim(),
                dto.getCategory() != null ? dto.getCategory() : SkillCategory.Programming,
                dto.getDescription(),
                dto.getLevel() != null ? dto.getLevel() : ProficiencyLevel.Intermediate
        );
        Skill saved = skillRepository.save(skill);
        return new SkillDto(String.valueOf(saved.getId()), saved.getName(), saved.getCategory(), saved.getDescription(), saved.getLevel());
    }

    @Transactional
    public List<SkillDto> getUserSkills(Long userId, SkillType skillType) {
        return userSkillRepository.findByUserIdAndSkillType(userId, skillType).stream()
                .map(us -> new SkillDto(
                        String.valueOf(us.getSkill().getId()),
                        us.getSkill().getName(),
                        us.getSkill().getCategory(),
                        us.getCustomDescription() != null ? us.getCustomDescription() : us.getSkill().getDescription(),
                        us.getProficiencyLevel() != null ? us.getProficiencyLevel() : us.getSkill().getLevel()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto addUserSkill(User currentUser, UserSkillRequest request) {
        Skill skill;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        } else {
            skill = skillRepository.findByNameIgnoreCase(request.getName().trim())
                    .orElseGet(() -> skillRepository.save(new Skill(
                            request.getName().trim(),
                            request.getCategory(),
                            request.getDescription(),
                            request.getLevel()
                    )));
        }

        SkillType type = request.getSkillType() != null ? request.getSkillType() : SkillType.OFFERED;

        Optional<UserSkill> existing = userSkillRepository.findByUserIdAndSkillIdAndSkillType(currentUser.getId(), skill.getId(), type);
        UserSkill userSkill;
        if (existing.isPresent()) {
            userSkill = existing.get();
            userSkill.setProficiencyLevel(request.getLevel());
            userSkill.setCustomDescription(request.getDescription());
        } else {
            userSkill = new UserSkill(currentUser, skill, type, request.getLevel(), request.getDescription());
        }

        UserSkill saved = userSkillRepository.save(userSkill);
        return new SkillDto(
                String.valueOf(saved.getSkill().getId()),
                saved.getSkill().getName(),
                saved.getSkill().getCategory(),
                saved.getCustomDescription() != null ? saved.getCustomDescription() : saved.getSkill().getDescription(),
                saved.getProficiencyLevel()
        );
    }

    @Transactional
    public void removeUserSkill(User currentUser, Long skillId, SkillType skillType) {
        Optional<UserSkill> us = userSkillRepository.findByUserIdAndSkillIdAndSkillType(currentUser.getId(), skillId, skillType);
        us.ifPresent(userSkillRepository::delete);
    }
}
