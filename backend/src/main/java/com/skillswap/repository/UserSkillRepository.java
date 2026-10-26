package com.skillswap.repository;

import com.skillswap.model.SkillType;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserId(Long userId);
    List<UserSkill> findByUserIdAndSkillType(Long userId, SkillType skillType);
    Optional<UserSkill> findByUserIdAndSkillIdAndSkillType(Long userId, Long skillId, SkillType skillType);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
}
