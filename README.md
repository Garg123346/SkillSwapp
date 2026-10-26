# SkillSwap — Student Skill Exchange Platform

> **BTech Java Full-Stack Lab Project**  
> **Backend:** Java 21 · Spring Boot 3.3.4 · Spring Data JPA · Spring Security (JWT) · PostgreSQL 16 · Maven  
> **Frontend:** React 19 · TypeScript · Tailwind CSS · TanStack Router · Vite  
> **Aesthetic:** Harvard Academic Elegance & MIT Innovative Spirit (Burgundy `#7A1735`, Deep Navy `#15263D`, Warm Ivory `#FAF8F4`)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Database Design & Schema](#database-design--schema)
4. [Pre-Seeded Demo Credentials](#pre-seeded-demo-credentials)
5. [Prerequisites & System Setup](#prerequisites--system-setup)
6. [Quick Start Guide](#quick-start-guide)
7. [Deploying to Vercel](#deploying-to-vercel)
8. [REST API Documentation](#rest-api-documentation)
9. [Automated Verification & Tests](#automated-verification--tests)
10. [BTech Java Lab Viva Voce Guide](#btech-java-lab-viva-voce-guide)

---

## Project Overview

**SkillSwap** is a peer-to-peer student skill exchange and mentorship platform built specifically for university campuses. Rather than paying monetary fees for tutoring, students teach skills they have mastered (e.g., Data Structures, React, French, UI/UX Design, Guitar) in exchange for learning credits to study other topics from campus peers.

### Key Capabilities
- **Stateless JWT Authentication**: Secure user registration, login, profile inspection, and role-based access control (`ROLE_STUDENT` and `ROLE_ADMIN`) with BCrypt password hashing.
- **Mentor Discovery & Filtering**: Search and filter student mentors by skill category, proficiency level, rating, and campus.
- **Interactive Session Requests**: End-to-end lifecycle management for peer sessions (Propose &rarr; Accept / Decline / Cancel &rarr; Complete &rarr; Peer Review).
- **Direct Messaging**: REST-based messaging threads between peers with unread counts and conversation history.
- **Campus Community Feed**: Collaborative student posts (Projects, Questions, Achievements) with like and bookmark capabilities.
- **Student Dashboard**: Live campus statistics, completed hours, active sessions, and AI-inspired mentor recommendations.

---

## Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│             SkillSwap React Frontend (Vite)            │
│         React 19 + TypeScript + Tailwind CSS           │
│        Port: 5173 (http://localhost:5173)              │
└─────────────────────────┬──────────────────────────────┘
                          │ HTTP REST / JSON (JWT Bearer)
                          ▼
┌────────────────────────────────────────────────────────┐
│            Spring Boot 3.3.4 Backend (Java 21)         │
│                                                        │
│  ┌────────────────────┐      ┌──────────────────────┐  │
│  │ Security & Filters │      │  REST Controllers    │  │
│  │  - JwtAuthFilter   │ ───► │  - AuthController    │  │
│  │  - BCryptEncoder   │      │  - MentorController  │  │
│  │  - CORS Config     │      │  - RequestController │  │
│  └────────────────────┘      │  - MessageController │  │
│                              │  - PostController    │  │
│                              └──────────┬───────────┘  │
│                                         ▼              │
│                              ┌──────────────────────┐  │
│                              │ Service Layer        │  │
│                              │ (Business Logic)     │  │
│                              └──────────┬───────────┘  │
│                                         ▼              │
│                              ┌──────────────────────┐  │
│                              │ Spring Data JPA      │  │
│                              │ (Hibernate 6)        │  │
│                              └──────────┬───────────┘  │
└─────────────────────────────────────────┼──────────────┘
                                          │ JDBC (HikariCP)
                                          ▼
┌────────────────────────────────────────────────────────┐
│                 PostgreSQL 16 Database                 │
│                      skillswap_db                      │
│                  Port: 5432 (localhost)                │
└────────────────────────────────────────────────────────┘
```

---

## Database Design & Schema

The relational database `skillswap_db` is defined in [`backend/src/main/resources/schema.sql`](file:///c:/Users/gauri/Downloads/skillswap/backend/src/main/resources/schema.sql) and managed via JPA entities:

1. **`users`**: Student and administrator accounts (`id`, `name`, `email`, `password_hash`, `college`, `department`, `study_year`, `role`, `bio`, `rating`, `review_count`, `hours_learned`, `hours_taught`, `created_at`).
2. **`skills`**: Catalog of standardized skills (`id`, `name`, `category`, `description`).
3. **`user_skills`**: Junction table mapping user offerings and learning goals (`id`, `user_id`, `skill_id`, `type` [TEACH/LEARN], `proficiency_level`).
4. **`session_requests`**: Session scheduling workflow (`id`, `requester_id`, `mentor_id`, `skill_id`, `proposed_date`, `learning_goals`, `status` [PENDING, ACCEPTED, DECLINED, COMPLETED, CANCELLED], `created_at`).
5. **`messages`**: Peer communications (`id`, `sender_id`, `receiver_id`, `content`, `sent_at`, `is_read`).
6. **`reviews`**: Session ratings and feedback (`id`, `reviewer_id`, `reviewed_id`, `session_id`, `rating`, `comment`, `created_at`).
7. **`community_posts`**: Campus feed articles (`id`, `author_id`, `title`, `content`, `category`, `image_url`, `created_at`).
8. **`post_likes`** & **`post_bookmarks`**: Many-to-many relationship tracking with unique constraints to prevent duplicates.

---

## Pre-Seeded Demo Credentials

Upon startup, the backend `DataInitializer` seeds the database with realistic campus data:

| Role | Name | Email | Password | Affiliation |
|---|---|---|---|---|
| **Administrator** | System Admin | `admin@skillswap.edu` | `Admin@123` | SkillSwap Academic Council |
| **Demo Student** | Camille Laurent | `camille.laurent@harvard.edu` | `SkillSwap2026` | Harvard CS & Literature |
| **Mentor** | Marcus Vance | `marcus.vance@mit.edu` | `SkillSwap2026` | MIT Computer Science |
| **Mentor** | Aisha Patel | `aisha.patel@stanford.edu` | `SkillSwap2026` | Stanford Design Institute |
| **Mentor** | David Kim | `david.kim@berkeley.edu` | `SkillSwap2026` | UC Berkeley Data Science |
| **Mentor** | Elena Rostova | `elena.rostova@oxford.edu` | `SkillSwap2026` | Oxford Modern Languages |

---

## Prerequisites & System Setup

Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK)**: Java 21 or higher (`java -version`)
- **Node.js**: v18+ and `pnpm` (`node -v`, `pnpm -v`)
- **PostgreSQL**: 16+ running on port 5432, or Docker Desktop for the bundled compose service

### PostgreSQL Database Setup
The easiest local setup is Docker:
```bash
docker compose up -d postgres
```
That starts PostgreSQL 16 on `localhost:5432` with database `skillswap_db`, user `skillswap`, and password `skillswap`.

If you already have PostgreSQL installed, create the database once:
```sql
CREATE USER skillswap WITH PASSWORD 'skillswap';
CREATE DATABASE skillswap_db OWNER skillswap;
```
Hibernate (`spring.jpa.hibernate.ddl-auto=update`) creates and updates tables from the JPA entities. The PostgreSQL DDL in [`backend/src/main/resources/schema.sql`](file:///c:/Users/gauri/Downloads/skillswap/backend/src/main/resources/schema.sql) is the reference schema.

---

## Quick Start Guide

### 1. Configure Backend Environment
In [`backend/`](file:///c:/Users/gauri/Downloads/skillswap/backend/), use `.env.example` as a reference and configure these values as environment variables in your shell or IDE run configuration. Spring Boot does not load `.env` files automatically.
```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillswap_db
DB_USER=skillswap
DB_PASSWORD=skillswap
```
Set `JWT_SECRET` to a newly generated signing key (for example, `openssl rand -base64 32`). The backend requires this value; never commit a real signing key.

### 2. Start the Spring Boot Backend
From the project root:
```bash
# Using the Maven wrapper (Windows):
mvnw.cmd spring-boot:run --file backend/pom.xml

# Or navigating into backend/:
cd backend
./mvnw spring-boot:run
```
The backend starts at `http://localhost:8080`.

### 3. Start the Frontend
In a new terminal window:
```bash
# From the project root:
pnpm run frontend

# Or navigating into src/frontend/:
cd src/frontend
pnpm dev
```
Open your browser and navigate to: `http://localhost:5173`

---

## Deploying to Vercel

Vercel deploys the React/Vite frontend. The Spring Boot API and PostgreSQL database
must be hosted separately; Vercel does not run this Java backend as a web
service.

1. Deploy `backend/` to a Java 21-compatible host and configure its PostgreSQL
   connection and a strong `JWT_SECRET`.
2. Import this repository into Vercel with the repository root as the project
   root. The root `vercel.json` configures the frontend build, static output,
   and client-side route fallback.
3. Add `VITE_API_URL` in the Vercel project settings for the Production and
   Preview environments. Set it to the public backend API URL, including
   `/api` (for example, `https://your-api.example.com/api`).
4. Redeploy after setting the environment variable. Configure the backend's
   CORS policy to allow the deployed Vercel domain.

For local development, copy `src/frontend/.env.example` to
`src/frontend/.env.local` if you need a non-default API URL. Otherwise Vite
proxies `/api` to the local backend at `http://localhost:8080`.

---

## REST API Documentation

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new student account |
| `POST` | `/auth/login` | No | Authenticate and obtain JWT Bearer token |
| `GET` | `/auth/me` | Yes | Retrieve the authenticated student's profile |
| `GET` | `/mentors` | No | List mentors with optional filters (`category`, `level`, `q`) |
| `GET` | `/mentors/{id}` | No | Retrieve detailed profile, skills, and reviews of a mentor |
| `GET` | `/skills` | No | Retrieve all skills catalog |
| `POST` | `/skills` | Yes | Add a new skill to user profile |
| `DELETE` | `/skills/{userSkillId}` | Yes | Remove a skill from user profile |
| `GET` | `/requests` | Yes | Retrieve current user's sent and received session requests |
| `POST` | `/requests` | Yes | Create a new session request with learning goals |
| `PATCH` | `/requests/{id}/status` | Yes | Update request status (`ACCEPTED`, `DECLINED`, `CANCELLED`, `COMPLETED`) |
| `GET` | `/messages/conversations` | Yes | List active conversation threads with unread counts |
| `GET` | `/messages/{otherUserId}` | Yes | Retrieve full message history with a peer |
| `POST` | `/messages` | Yes | Send a message to a peer |
| `GET` | `/community/posts` | No | Retrieve campus community posts |
| `POST` | `/community/posts` | Yes | Create a new community post |
| `POST` | `/community/posts/{id}/like` | Yes | Toggle like on a post |
| `POST` | `/community/posts/{id}/bookmark` | Yes | Toggle bookmark on a post |
| `GET` | `/dashboard/stats` | Yes | Retrieve live student metrics, hours, and upcoming sessions |

---

## Automated Verification & Tests

### Running Backend Tests
The backend includes integration and unit tests for authentication, authorization, and session requests using MockMvc and in-memory H2:
```bash
mvnw.cmd test --file backend/pom.xml
```

### Running Frontend Checks
```bash
cd src/frontend
pnpm run typecheck    # Verifies strict TypeScript compliance (0 errors)
pnpm run fix          # Biome formatting and lint check (0 errors)
pnpm run build        # Production bundle build with Vite (0 errors)
```

---

## BTech Java Lab Viva Voce Guide

### Q1: What is Spring Boot and why was it chosen over standard Spring MVC?
**Answer:** Spring Boot provides opinionated starter dependencies (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`) and automated configuration. It eliminates boilerplate XML configuration, provides an embedded Tomcat server (port 8080), and configures HikariCP connection pooling automatically.

### Q2: How is authentication and authorization implemented?
**Answer:** Authentication is stateless using **JSON Web Tokens (JWT)** and **Spring Security 6**:
1. When a user submits their credentials to `/api/auth/login`, `DaoAuthenticationProvider` checks the credentials against `UserDetailsService`.
2. Passwords are encrypted and verified using `BCryptPasswordEncoder` (salted one-way hashing).
3. Upon successful verification, `JwtTokenProvider` signs a JWT containing the user's email, ID, and roles.
4. On subsequent requests, `JwtAuthenticationFilter` intercepts the request, validates the Bearer token in the `Authorization` header, and populates the `SecurityContextHolder`.

### Q3: What is Spring Data JPA and what are the Entity Relationships?
**Answer:** Spring Data JPA builds on top of Hibernate (JPA provider). It eliminates boilerplate DAO implementations by generating dynamic queries from repository interfaces (`JpaRepository`).
- Relationships used in SkillSwap:
  - `@ManyToOne` between `UserSkill` and `User` / `Skill`
  - `@ManyToOne` between `SessionRequest` and requester/mentor `User`
  - `@ManyToOne` between `Message` and sender/receiver `User`
  - `@ManyToOne` between `Review` and reviewer/reviewed `User`

### Q4: How does Cross-Origin Resource Sharing (CORS) work?
**Answer:** Browsers enforce the Same-Origin Policy. Since our React frontend runs on `http://localhost:5173` and the Spring Boot backend runs on `http://localhost:8080`, requests are cross-origin. We configure a `CorsConfigurationSource` bean in `SecurityConfig` allowing `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS` with credentials and headers.

### Q5: How does the Session Request state machine prevent invalid transitions?
**Answer:** In `SessionRequestService`:
1. Requests start as `PENDING`.
2. Only the mentor can transition a `PENDING` request to `ACCEPTED` or `DECLINED`.
3. Only the requester can `CANCEL` a `PENDING` request.
4. Only an `ACCEPTED` session can be marked as `COMPLETED`.
5. Only `COMPLETED` sessions permit peer reviews, ensuring verified ratings.
