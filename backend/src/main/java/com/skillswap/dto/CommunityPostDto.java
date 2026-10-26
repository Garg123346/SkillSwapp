package com.skillswap.dto;

import com.skillswap.model.SkillCategory;
import java.util.ArrayList;
import java.util.List;

public class CommunityPostDto {
    private String id;
    private String authorId;
    private String authorName;
    private String authorInitials;
    private String authorUniversity;
    private SkillCategory category;
    private String postType;
    private String title;
    private String body;
    private int likes;
    private int replies;
    private String postedAt;
    private List<String> tags = new ArrayList<>();
    private String imageUrl;
    private boolean isLiked;
    private boolean isBookmarked;

    public CommunityPostDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorInitials() { return authorInitials; }
    public void setAuthorInitials(String authorInitials) { this.authorInitials = authorInitials; }

    public String getAuthorUniversity() { return authorUniversity; }
    public void setAuthorUniversity(String authorUniversity) { this.authorUniversity = authorUniversity; }

    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public int getReplies() { return replies; }
    public void setReplies(int replies) { this.replies = replies; }

    public String getPostedAt() { return postedAt; }
    public void setPostedAt(String postedAt) { this.postedAt = postedAt; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isLiked() { return isLiked; }
    public void setLiked(boolean liked) { isLiked = liked; }

    public boolean isBookmarked() { return isBookmarked; }
    public void setBookmarked(boolean bookmarked) { isBookmarked = bookmarked; }
}
