package com.skillswap.dto;

import com.skillswap.model.SkillCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class CommunityPostCreateDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Post body is required")
    private String body;

    @NotNull(message = "Category is required")
    private SkillCategory category;

    private String postType = "project";
    private List<String> tags = new ArrayList<>();
    private String imageUrl;

    public CommunityPostCreateDto() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
