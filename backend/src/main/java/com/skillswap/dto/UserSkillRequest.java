package com.skillswap.dto;

import com.skillswap.model.ProficiencyLevel;
import com.skillswap.model.SkillCategory;
import com.skillswap.model.SkillType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserSkillRequest {
    private Long skillId;

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotNull(message = "Skill category is required")
    private SkillCategory category;

    @NotNull(message = "Proficiency level is required")
    private ProficiencyLevel level;

    private String description;

    private SkillType skillType = SkillType.OFFERED;

    public UserSkillRequest() {}

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }

    public ProficiencyLevel getLevel() { return level; }
    public void setLevel(ProficiencyLevel level) { this.level = level; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public SkillType getSkillType() { return skillType; }
    public void setSkillType(SkillType skillType) { this.skillType = skillType; }
}
