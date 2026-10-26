package com.skillswap.repository;

import com.skillswap.model.Role;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN u.userSkills us " +
           "LEFT JOIN us.skill s " +
           "WHERE (:query IS NULL OR :query = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.bio) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchMentors(@Param("query") String query);
}
