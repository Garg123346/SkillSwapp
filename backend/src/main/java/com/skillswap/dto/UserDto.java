package com.skillswap.dto;

import com.skillswap.model.Role;
import java.util.ArrayList;
import java.util.List;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private String title;
    private String university;
    private String college;
    private String department;
    private String program;
    private String year;
    private String city;
    private Role role;
    private String bio;
    private String avatarInitials;
    private Integer credits;
    private Integer hourlyCredits;
    private Double rating;
    private Integer reviewCount;
    private Integer sessionCount;
    private String availability;
    private List<String> languages = new ArrayList<>();
    private Boolean featured;
    private String joinedAt;
    private List<SkillDto> teaches = new ArrayList<>();
    private List<SkillDto> wantsToLearn = new ArrayList<>();
    private List<SkillDto> skillsOffered = new ArrayList<>();
    private List<SkillDto> skillsWanted = new ArrayList<>();
    private List<ReviewDto> reviews = new ArrayList<>();

    public UserDto() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { 
        this.university = university; 
        this.college = university;
    }

    public String getCollege() { return college; }
    public void setCollege(String college) { 
        this.college = college; 
        this.university = college;
    }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { 
        this.department = department; 
        this.program = department;
    }

    public String getProgram() { return program; }
    public void setProgram(String program) { 
        this.program = program; 
        this.department = program;
    }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public Integer getHourlyCredits() { return hourlyCredits; }
    public void setHourlyCredits(Integer hourlyCredits) { this.hourlyCredits = hourlyCredits; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Integer getSessionCount() { return sessionCount; }
    public void setSessionCount(Integer sessionCount) { this.sessionCount = sessionCount; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getJoinedAt() { return joinedAt; }
    public void setJoinedAt(String joinedAt) { this.joinedAt = joinedAt; }

    public List<SkillDto> getTeaches() { return teaches; }
    public void setTeaches(List<SkillDto> teaches) { 
        this.teaches = teaches; 
        this.skillsOffered = teaches;
    }

    public List<SkillDto> getWantsToLearn() { return wantsToLearn; }
    public void setWantsToLearn(List<SkillDto> wantsToLearn) { 
        this.wantsToLearn = wantsToLearn; 
        this.skillsWanted = wantsToLearn;
    }

    public List<SkillDto> getSkillsOffered() { return skillsOffered; }
    public void setSkillsOffered(List<SkillDto> skillsOffered) { 
        this.skillsOffered = skillsOffered; 
        this.teaches = skillsOffered;
    }

    public List<SkillDto> getSkillsWanted() { return skillsWanted; }
    public void setSkillsWanted(List<SkillDto> skillsWanted) { 
        this.skillsWanted = skillsWanted; 
        this.wantsToLearn = skillsWanted;
    }

    public List<ReviewDto> getReviews() { return reviews; }
    public void setReviews(List<ReviewDto> reviews) { this.reviews = reviews; }
}
