package com.skillswap.config;

import com.skillswap.model.*;
import com.skillswap.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final SessionRequestRepository sessionRequestRepository;
    private final ReviewRepository reviewRepository;
    private final MessageRepository messageRepository;
    private final CommunityPostRepository communityPostRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           SkillRepository skillRepository,
                           UserSkillRepository userSkillRepository,
                           SessionRequestRepository sessionRequestRepository,
                           ReviewRepository reviewRepository,
                           MessageRepository messageRepository,
                           CommunityPostRepository communityPostRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.sessionRequestRepository = sessionRequestRepository;
        this.reviewRepository = reviewRepository;
        this.messageRepository = messageRepository;
        this.communityPostRepository = communityPostRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data, skipping initialization.");
            return;
        }

        log.info("Starting SkillSwap database initialization with demo data...");

        // 1. Create Admin
        User admin = new User();
        admin.setName("System Administrator");
        admin.setEmail("admin@skillswap.edu");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setCollege("SkillSwap Global Academic Network");
        admin.setDepartment("Academic Administration");
        admin.setStudyYear("Faculty / Staff");
        admin.setRole(Role.ROLE_ADMIN);
        admin.setBio("Platform administrator overseeing student skill exchange integrity, safety, and community guidelines.");
        admin.setAvatarInitials("AD");
        admin.setCredits(999);
        admin.setHourlyCredits(1);
        admin.setRating(5.0);
        admin.setReviewCount(0);
        admin.setSessionCount(0);
        admin.setAvailability("Mon-Fri (9 AM - 5 PM)");
        admin.setLanguages("English");
        admin.setFeatured(false);
        userRepository.save(admin);

        // 2. Create Default Student User (Matching frontend demo account)
        User camille = new User();
        camille.setName("Camille Laurent");
        camille.setEmail("camille.laurent@harvard.edu");
        camille.setPassword(passwordEncoder.encode("SkillSwap2026"));
        camille.setCollege("Harvard University / BITS Pilani");
        camille.setDepartment("Computer Science & Engineering");
        camille.setStudyYear("3rd Year");
        camille.setRole(Role.ROLE_STUDENT);
        camille.setBio("3rd-year CS student passionate about full-stack web development, distributed systems, and clean UI engineering. Experienced with TypeScript, React, and Java.");
        camille.setAvatarInitials("CL");
        camille.setCredits(14);
        camille.setHourlyCredits(1);
        camille.setRating(4.9);
        camille.setReviewCount(18);
        camille.setSessionCount(24);
        camille.setAvailability("Mon, Wed, Fri (After 6 PM)");
        camille.setLanguages("English, French, Hindi");
        camille.setFeatured(true);
        userRepository.save(camille);

        // 3. Create Additional Student Mentors
        User alex = new User();
        alex.setName("Alexandre Mercier");
        alex.setEmail("alex.mercier@design.edu");
        alex.setPassword(passwordEncoder.encode("SkillSwap2026"));
        alex.setCollege("National Institute of Design / MIT");
        alex.setDepartment("Interaction & Visual Design");
        alex.setStudyYear("4th Year");
        alex.setRole(Role.ROLE_STUDENT);
        alex.setBio("Final-year design student focused on design systems, Figma workflows, and micro-interactions. Mentored 30+ students on crafting polished UI portfolios.");
        alex.setAvatarInitials("AM");
        alex.setCredits(18);
        alex.setHourlyCredits(1);
        alex.setRating(5.0);
        alex.setReviewCount(24);
        alex.setSessionCount(32);
        alex.setAvailability("Tue, Thu, Sat (After 5 PM)");
        alex.setLanguages("English, French");
        alex.setFeatured(true);
        userRepository.save(alex);

        User priya = new User();
        priya.setName("Priya Nair");
        priya.setEmail("priya.nair@iitb.ac.in");
        priya.setPassword(passwordEncoder.encode("SkillSwap2026"));
        priya.setCollege("Indian Institute of Technology, Bombay");
        priya.setDepartment("Artificial Intelligence & Data Science");
        priya.setStudyYear("M.Tech 1st Year");
        priya.setRole(Role.ROLE_STUDENT);
        priya.setBio("Researcher working on deep learning, computer vision, and PyTorch model optimization. Love teaching complex mathematical concepts with intuitive visuals.");
        priya.setAvatarInitials("PN");
        priya.setCredits(12);
        priya.setHourlyCredits(1);
        priya.setRating(4.85);
        priya.setReviewCount(14);
        priya.setSessionCount(19);
        priya.setAvailability("Weekends (10 AM - 4 PM)");
        priya.setLanguages("English, Hindi, Malayalam");
        priya.setFeatured(true);
        userRepository.save(priya);

        User rohan = new User();
        rohan.setName("Rohan Mehta");
        rohan.setEmail("rohan.mehta@dtu.ac.in");
        rohan.setPassword(passwordEncoder.encode("SkillSwap2026"));
        rohan.setCollege("Delhi Technological University");
        rohan.setDepartment("Software Engineering");
        rohan.setStudyYear("4th Year");
        rohan.setRole(Role.ROLE_STUDENT);
        rohan.setBio("Competitive programmer and backend specialist. 5-star coder on CodeChef. Passionate about algorithms, low-level design, and high-performance Java APIs.");
        rohan.setAvatarInitials("RM");
        rohan.setCredits(15);
        rohan.setHourlyCredits(1);
        rohan.setRating(4.95);
        rohan.setReviewCount(21);
        rohan.setSessionCount(28);
        rohan.setAvailability("Mon, Thu, Sun (Evenings)");
        rohan.setLanguages("English, Hindi");
        rohan.setFeatured(true);
        userRepository.save(rohan);

        User elena = new User();
        elena.setName("Elena Rostova");
        elena.setEmail("elena.rostova@cambridge.edu");
        elena.setPassword(passwordEncoder.encode("SkillSwap2026"));
        elena.setCollege("University of Cambridge / Oxford");
        elena.setDepartment("Applied Mathematics & Statistics");
        elena.setStudyYear("PhD Candidate");
        elena.setRole(Role.ROLE_STUDENT);
        elena.setBio("PhD researcher helping undergraduate students structure academic research papers, thesis arguments, and experimental statistical tests in R and Python.");
        elena.setAvatarInitials("ER");
        elena.setCredits(10);
        elena.setHourlyCredits(1);
        elena.setRating(4.9);
        elena.setReviewCount(11);
        elena.setSessionCount(15);
        elena.setAvailability("Wed, Fri, Sun (After 4 PM)");
        elena.setLanguages("English, Russian, French");
        elena.setFeatured(true);
        userRepository.save(elena);

        User lucas = new User();
        lucas.setName("Lucas Dubois");
        lucas.setEmail("lucas.dubois@sorbonne.edu");
        lucas.setPassword(passwordEncoder.encode("SkillSwap2026"));
        lucas.setCollege("Sorbonne University");
        lucas.setDepartment("Musicology & Audio Engineering");
        lucas.setStudyYear("3rd Year");
        lucas.setRole(Role.ROLE_STUDENT);
        lucas.setBio("Classical guitar player and Ableton Live audio producer. Teaching fingerstyle techniques, harmony, and modern digital track mixing.");
        lucas.setAvatarInitials("LD");
        lucas.setCredits(8);
        lucas.setHourlyCredits(1);
        lucas.setRating(4.8);
        lucas.setReviewCount(9);
        lucas.setSessionCount(12);
        lucas.setAvailability("Tue, Thu, Sat (3 PM - 7 PM)");
        lucas.setLanguages("English, French, Spanish");
        lucas.setFeatured(true);
        userRepository.save(lucas);

        // 4. Create Skills
        Skill reactSkill = skillRepository.save(new Skill("React & Next.js", SkillCategory.Programming, "Modern React with Hooks, state management, and SSR patterns.", ProficiencyLevel.Advanced));
        Skill javaSkill = skillRepository.save(new Skill("Java Spring Boot", SkillCategory.Programming, "Enterprise backend architecture with JPA, Security, and REST APIs.", ProficiencyLevel.Expert));
        Skill figmaSkill = skillRepository.save(new Skill("UI/UX Design in Figma", SkillCategory.Design, "Wireframing, typography hierarchies, component libraries, and interactive prototyping.", ProficiencyLevel.Expert));
        Skill mlSkill = skillRepository.save(new Skill("Machine Learning & PyTorch", SkillCategory.Programming, "Supervised learning, deep neural networks, and model training in Python.", ProficiencyLevel.Advanced));
        Skill dsaSkill = skillRepository.save(new Skill("Data Structures & Algorithms", SkillCategory.Programming, "Graph traversals, dynamic programming, and interview problem-solving.", ProficiencyLevel.Expert));
        Skill frenchSkill = skillRepository.save(new Skill("Conversational French", SkillCategory.Languages, "Grammar fundamentals, pronunciation, and everyday conversational fluency.", ProficiencyLevel.Advanced));
        Skill statsSkill = skillRepository.save(new Skill("Statistical Analysis & R", SkillCategory.Academics, "Hypothesis testing, regression modeling, and academic publication analysis.", ProficiencyLevel.Expert));
        Skill guitarSkill = skillRepository.save(new Skill("Acoustic & Classical Guitar", SkillCategory.Music, "Fingerpicking patterns, chord transitions, and music theory fundamentals.", ProficiencyLevel.Intermediate));
        Skill ceramicsSkill = skillRepository.save(new Skill("Ceramic Sculpting & Pottery", SkillCategory.Crafts, "Hand-building, wheel throwing basics, and glazing craftwork.", ProficiencyLevel.Intermediate));
        Skill rustSkill = skillRepository.save(new Skill("Rust Systems Programming", SkillCategory.Programming, "Memory safety without garbage collection, borrow checker, and concurrency.", ProficiencyLevel.Beginner));

        // 5. Connect UserSkills (Offered and Wanted)
        userSkillRepository.save(new UserSkill(camille, reactSkill, SkillType.OFFERED, ProficiencyLevel.Advanced, "Teaching component architecture, React 19 hooks, and clean UI styling."));
        userSkillRepository.save(new UserSkill(camille, javaSkill, SkillType.OFFERED, ProficiencyLevel.Advanced, "Teaching Spring Boot REST APIs, Spring Security, and PostgreSQL database integration."));
        userSkillRepository.save(new UserSkill(camille, figmaSkill, SkillType.WANTED, ProficiencyLevel.Beginner, "Wanting to master wireframing and Figma auto-layout."));
        userSkillRepository.save(new UserSkill(camille, rustSkill, SkillType.WANTED, ProficiencyLevel.Beginner, "Excited to learn systems programming in Rust."));

        userSkillRepository.save(new UserSkill(alex, figmaSkill, SkillType.OFFERED, ProficiencyLevel.Expert, "In-depth design system workshops and portfolio reviews."));
        userSkillRepository.save(new UserSkill(alex, reactSkill, SkillType.WANTED, ProficiencyLevel.Beginner, "Wanting to turn my Figma mockups into interactive React components."));

        userSkillRepository.save(new UserSkill(priya, mlSkill, SkillType.OFFERED, ProficiencyLevel.Advanced, "Hands-on PyTorch training for computer vision and NLP models."));
        userSkillRepository.save(new UserSkill(priya, frenchSkill, SkillType.WANTED, ProficiencyLevel.Beginner, "Preparing for a summer research internship in France."));

        userSkillRepository.save(new UserSkill(rohan, dsaSkill, SkillType.OFFERED, ProficiencyLevel.Expert, "Step-by-step guidance on LeetCode patterns and algorithm optimization."));
        userSkillRepository.save(new UserSkill(rohan, reactSkill, SkillType.WANTED, ProficiencyLevel.Intermediate, "Looking to build full-stack web applications for my projects."));

        userSkillRepository.save(new UserSkill(elena, statsSkill, SkillType.OFFERED, ProficiencyLevel.Expert, "Research paper coaching and data visualization with R."));
        userSkillRepository.save(new UserSkill(elena, frenchSkill, SkillType.WANTED, ProficiencyLevel.Intermediate, "Polishing conversational French for academic conferences."));

        userSkillRepository.save(new UserSkill(lucas, guitarSkill, SkillType.OFFERED, ProficiencyLevel.Advanced, "Acoustic fingerstyle and rhythm accompaniment techniques."));
        userSkillRepository.save(new UserSkill(lucas, reactSkill, SkillType.WANTED, ProficiencyLevel.Beginner, "Building a personal portfolio website for my music tracks."));

        // 6. Seed Sample Reviews
        reviewRepository.save(new Review(alex, camille, null, 5, "Camille is an exceptional mentor! He explained React state hooks and API integration with complete clarity. Highly recommended."));
        reviewRepository.save(new Review(priya, camille, null, 5, "Great session! Camille helped me set up my frontend interface and debug complex asynchronous state issues in less than an hour."));
        reviewRepository.save(new Review(camille, alex, null, 5, "Alexandre's design feedback transformed my project's visual elegance. His breakdown of typography and whitespace was invaluable."));
        reviewRepository.save(new Review(camille, rohan, null, 5, "Rohan's algorithm session demystified dynamic programming patterns for me. Brilliant teaching style!"));

        // 7. Seed Session Requests
        SessionRequest req1 = new SessionRequest(camille, alex, "UI/UX Design in Figma", "Saturday at 4:00 PM", "Learn design systems and responsive token layouts for student portfolio.");
        req1.setStatus(RequestStatus.Accepted);
        sessionRequestRepository.save(req1);

        SessionRequest req2 = new SessionRequest(rohan, camille, "React & Next.js", "Sunday at 6:00 PM", "Need assistance building frontend state management for an open-source project.");
        req2.setStatus(RequestStatus.Pending);
        sessionRequestRepository.save(req2);

        SessionRequest req3 = new SessionRequest(priya, camille, "Java Spring Boot", "Last Wednesday", "Configured JWT security filters and verified role authorization.");
        req3.setStatus(RequestStatus.Completed);
        sessionRequestRepository.save(req3);

        // 8. Seed Messages
        Message m1 = new Message(alex, camille, "Hi Camille! Looking forward to our Saturday Figma session. Have your project wireframes ready!");
        messageRepository.save(m1);
        Message m2 = new Message(camille, alex, "Thanks Alexandre! I have the component structure ready in my sketch pad. See you Saturday at 4 PM!");
        messageRepository.save(m2);

        Message m3 = new Message(rohan, camille, "Hey Camille, saw your profile on the explore page. Would love to swap some DSA tips for React frontend tips!");
        messageRepository.save(m3);

        // 9. Seed Community Posts
        CommunityPost p1 = new CommunityPost(camille, "Built a Real-time Student Collaboration Canvas with React & TypeScript",
                "Just completed a major milestone on our campus project. Learned a ton about performant DOM rendering, responsive CSS grids, and clean component isolation. What state management pattern do you recommend for canvas tools?",
                SkillCategory.Programming, "project", "React,TypeScript,FullStack", "/assets/generated/community-react.dim_1200x675.jpg");
        p1.setLikes(42);
        p1.setReplies(14);
        communityPostRepository.save(p1);

        CommunityPost p2 = new CommunityPost(alex, "Typography & Whitespace: The Subtle Art of Academic Elegance",
                "Sharing a comprehensive visual breakdown of how serif headings pair with minimalist sans-serif body text for modern academic software interfaces. Check out the hierarchy rules and token guidelines!",
                SkillCategory.Design, "project", "Design,Typography,Figma", "/assets/generated/community-typo.dim_1200x675.jpg");
        p2.setLikes(87);
        p2.setReplies(31);
        communityPostRepository.save(p2);

        CommunityPost p3 = new CommunityPost(priya, "Beginner's Guide to Fine-Tuning Lightweight Neural Networks on a Laptop",
                "Many students asked how to train machine learning models without expensive GPU cloud instances. Here is my curated list of quantized models, parameter-efficient fine-tuning (PEFT), and free Colab environments.",
                SkillCategory.Programming, "achievement", "AI,MachineLearning,Python", null);
        p3.setLikes(112);
        p3.setReplies(45);
        communityPostRepository.save(p3);

        CommunityPost p4 = new CommunityPost(lucas, "How Playing an Instrument Enhances Algorithmic Thinking",
                "Polyphonic rhythm and counterpoint in classical music share deep structural mathematical beauty with recursive algorithms. Starting an informal acoustic guitar jam session this Friday!",
                SkillCategory.Music, "project", "Music,Guitar,Creativity", "/assets/generated/community-music.dim_1200x675.jpg");
        p4.setLikes(35);
        p4.setReplies(12);
        communityPostRepository.save(p4);

        log.info("SkillSwap database initialization completed successfully!");
    }
}
