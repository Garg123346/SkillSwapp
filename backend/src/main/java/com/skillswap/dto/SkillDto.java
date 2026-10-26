package com.skillswap.dto;

import com.skillswap.model.ProficiencyLevel;
import com.skillswap.model.SkillCategory;

public class SkillDto {
    private String id;
    private String name;
    private SkillCategory category;
    private String description;
    private ProficiencyLevel level;

    public SkillDto() {}

    public SkillDto(String id, String name, SkillCategory category, String description, ProficiencyLevel level) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.level = level;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProficiencyLevel getLevel() { return level; }
    public void setLevel(ProficiencyLevel level) { this.level = level; }
}
