package com.skillswap.service;

import com.skillswap.dto.CommunityPostCreateDto;
import com.skillswap.dto.CommunityPostDto;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.exception.UnauthorizedException;
import com.skillswap.model.*;
import com.skillswap.repository.CommunityPostRepository;
import com.skillswap.repository.PostBookmarkRepository;
import com.skillswap.repository.PostLikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommunityPostService {

    private final CommunityPostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostBookmarkRepository bookmarkRepository;

    public CommunityPostService(CommunityPostRepository postRepository,
                                PostLikeRepository likeRepository,
                                PostBookmarkRepository bookmarkRepository) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    @Transactional(readOnly = true)
    public List<CommunityPostDto> getAllPosts(User currentUser, String categoryStr, String postType) {
        List<CommunityPost> posts;
        if (categoryStr != null && !categoryStr.trim().isEmpty() && !categoryStr.equalsIgnoreCase("Tous")) {
            try {
                SkillCategory cat = SkillCategory.fromString(categoryStr);
                posts = postRepository.findByCategoryOrderByCreatedAtDesc(cat);
            } catch (Exception e) {
                posts = postRepository.findAllByOrderByCreatedAtDesc();
            }
        } else if (postType != null && !postType.trim().isEmpty()) {
            posts = postRepository.findByPostTypeOrderByCreatedAtDesc(postType.trim().toLowerCase());
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream()
                .map(p -> mapToDto(p, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityPostDto createPost(User currentUser, CommunityPostCreateDto dto) {
        String tagsJoined = dto.getTags() != null ? String.join(",", dto.getTags()) : "";
        CommunityPost post = new CommunityPost(
                currentUser,
                dto.getTitle().trim(),
                dto.getBody().trim(),
                dto.getCategory() != null ? dto.getCategory() : SkillCategory.Programming,
                dto.getPostType() != null ? dto.getPostType() : "project",
                tagsJoined,
                dto.getImageUrl()
        );

        CommunityPost saved = postRepository.save(post);
        return mapToDto(saved, currentUser);
    }

    @Transactional
    public void deletePost(User currentUser, Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with ID: " + postId));

        if (!post.getAuthor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not allowed to delete another user's post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public Map<String, Object> toggleLike(User currentUser, Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with ID: " + postId));

        Optional<PostLike> existing = likeRepository.findByUserIdAndPostId(currentUser.getId(), postId);
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            post.setLikes(Math.max(0, post.getLikes() - 1));
            liked = false;
        } else {
            likeRepository.save(new PostLike(currentUser, post));
            post.setLikes(post.getLikes() + 1);
            liked = true;
        }
        postRepository.save(post);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", liked);
        result.put("likesCount", post.getLikes());
        return result;
    }

    @Transactional
    public Map<String, Object> toggleBookmark(User currentUser, Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with ID: " + postId));

        Optional<PostBookmark> existing = bookmarkRepository.findByUserIdAndPostId(currentUser.getId(), postId);
        boolean bookmarked;
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            bookmarked = false;
        } else {
            bookmarkRepository.save(new PostBookmark(currentUser, post));
            bookmarked = true;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("bookmarked", bookmarked);
        return result;
    }

    private CommunityPostDto mapToDto(CommunityPost post, User currentUser) {
        CommunityPostDto dto = new CommunityPostDto();
        dto.setId(String.valueOf(post.getId()));
        dto.setAuthorId(String.valueOf(post.getAuthor().getId()));
        dto.setAuthorName(post.getAuthor().getName());
        dto.setAuthorInitials(post.getAuthor().getAvatarInitials());
        dto.setAuthorUniversity(post.getAuthor().getCollege() != null ? post.getAuthor().getCollege() : "Campus");
        dto.setCategory(post.getCategory());
        dto.setPostType(post.getPostType());
        dto.setTitle(post.getTitle());
        dto.setBody(post.getBody());
        dto.setLikes(post.getLikes());
        dto.setReplies(post.getReplies());
        dto.setImageUrl(post.getImageUrl());

        if (post.getCreatedAt() != null) {
            dto.setPostedAt(post.getCreatedAt().format(DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH)));
        }

        if (post.getTags() != null && !post.getTags().isBlank()) {
            dto.setTags(Arrays.stream(post.getTags().split(","))
                    .map(String::trim)
                    .filter(t -> !t.isEmpty())
                    .collect(Collectors.toList()));
        }

        if (currentUser != null) {
            dto.setLiked(likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId()));
            dto.setBookmarked(bookmarkRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId()));
        }

        return dto;
    }
}
