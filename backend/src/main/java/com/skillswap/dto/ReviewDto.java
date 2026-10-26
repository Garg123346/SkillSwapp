package com.skillswap.dto;

public class ReviewDto {
    private String id;
    private String authorName;
    private String authorUniversity;
    private String authorInitials;
    private double rating;
    private String comment;
    private String date;

    public ReviewDto() {}

    public ReviewDto(String id, String authorName, String authorUniversity, String authorInitials, double rating, String comment, String date) {
        this.id = id;
        this.authorName = authorName;
        this.authorUniversity = authorUniversity;
        this.authorInitials = authorInitials;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorUniversity() { return authorUniversity; }
    public void setAuthorUniversity(String authorUniversity) { this.authorUniversity = authorUniversity; }

    public String getAuthorInitials() { return authorInitials; }
    public void setAuthorInitials(String authorInitials) { this.authorInitials = authorInitials; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
