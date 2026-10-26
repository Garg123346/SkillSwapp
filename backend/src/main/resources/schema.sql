-- =====================================================================
-- SkillSwap Database Initialization Script (PostgreSQL 16)
-- Database: skillswap_db
--
-- Create the database once (as a superuser), then connect to it:
--   CREATE DATABASE skillswap_db;
--   \c skillswap_db
-- Or start the bundled instance: docker compose up -d postgres
-- =====================================================================

DROP TABLE IF EXISTS post_bookmarks CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS session_requests CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(150) NULL,
    department VARCHAR(100) NULL,
    study_year VARCHAR(50) NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_STUDENT',
    bio TEXT NULL,
    avatar_initials VARCHAR(10) NULL,
    credits INT NOT NULL DEFAULT 10,
    hourly_credits INT NOT NULL DEFAULT 1,
    rating DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    review_count INT NOT NULL DEFAULT 0,
    session_count INT NOT NULL DEFAULT 0,
    availability VARCHAR(120) DEFAULT 'Mon, Wed, Fri (After 5 PM)',
    languages VARCHAR(200) DEFAULT 'English, Hindi',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- 2. Skills Table
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description VARCHAR(500) NULL,
    level VARCHAR(30) NOT NULL DEFAULT 'Intermediate',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_skills_category ON skills (category);
CREATE INDEX idx_skills_name ON skills (name);

-- 3. UserSkills Table (Skills offered and wanted by each student)
CREATE TABLE user_skills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    skill_type VARCHAR(30) NOT NULL, -- 'OFFERED' (teaching) or 'WANTED' (learning)
    proficiency_level VARCHAR(30) NULL,
    custom_description VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_userskills_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_userskills_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_skill_type UNIQUE (user_id, skill_id, skill_type)
);

-- 4. SessionRequests Table
CREATE TABLE session_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    preferred_date VARCHAR(120) NULL,
    learning_goals TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Rejected, Completed, Cancelled
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_requester FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_requests_mentor FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 5. Messages Table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    conversation_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_messages_conversation ON messages (conversation_id);

-- 6. Reviews Table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    session_request_id BIGINT NULL,
    rating INT NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_mentor FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_session FOREIGN KEY (session_request_id) REFERENCES session_requests (id) ON DELETE SET NULL
);

-- 7. CommunityPosts Table
CREATE TABLE community_posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(40) NOT NULL,
    post_type VARCHAR(30) NOT NULL DEFAULT 'project',
    tags VARCHAR(255) NULL,
    image_url VARCHAR(500) NULL,
    likes_count INT NOT NULL DEFAULT 0,
    replies_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 8. PostLikes Table
CREATE TABLE post_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_post_like UNIQUE (user_id, post_id)
);

-- 9. PostBookmarks Table
CREATE TABLE post_bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_post_bookmark UNIQUE (user_id, post_id)
);
