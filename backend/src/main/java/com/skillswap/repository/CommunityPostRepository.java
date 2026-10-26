package com.skillswap.repository;

import com.skillswap.model.CommunityPost;
import com.skillswap.model.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
    List<CommunityPost> findByCategoryOrderByCreatedAtDesc(SkillCategory category);
    List<CommunityPost> findByPostTypeOrderByCreatedAtDesc(String postType);
    List<CommunityPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
