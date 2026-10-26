import type {
  CommunityPost,
  Conversation,
  Mentor,
  Message,
  Review,
  SessionRequest,
  Skill,
  SkillCategory,
  StudentProfile,
  Testimonial,
} from "./types";

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Programming",
  "Design",
  "Languages",
  "Music",
  "Academics",
  "Crafts",
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Programming:
    "Web development, algorithms, cloud architecture, and data tools.",
  Design:
    "Visual identity, UI/UX prototyping, design systems, and illustration.",
  Languages: "Conversational fluency, grammar mastery, and exam preparation.",
  Music: "Instrument mastery, harmony, production mixing, and ear training.",
  Academics:
    "Research methodology, academic writing, advanced math, and physics.",
  Crafts: "Ceramic sculpting, pottery, woodworking, and artisanal crafting.",
  // Aliases for backwards compatibility
  Programmation:
    "Web development, algorithms, cloud architecture, and data tools.",
  Langues: "Conversational fluency, grammar mastery, and exam preparation.",
  Musique: "Instrument mastery, harmony, production mixing, and ear training.",
  Académique:
    "Research methodology, academic writing, advanced math, and physics.",
  Artisanat: "Ceramic sculpting, pottery, woodworking, and artisanal crafting.",
};

export const SKILLS: Skill[] = [
  {
    id: "sk-1",
    name: "React & Next.js",
    category: "Programming",
    description: "Component architecture, hooks, and clean UI engineering.",
    level: "Advanced",
  },
  {
    id: "sk-2",
    name: "Java Spring Boot",
    category: "Programming",
    description:
      "Enterprise backend architecture with JPA, Security, and REST APIs.",
    level: "Expert",
  },
  {
    id: "sk-3",
    name: "Data Structures & Algorithms",
    category: "Programming",
    description:
      "Graph traversals, dynamic programming, and interview patterns.",
    level: "Expert",
  },
  {
    id: "sk-4",
    name: "UI/UX Design in Figma",
    category: "Design",
    description:
      "Design systems, auto-layout, wireframes, and interactive prototypes.",
    level: "Expert",
  },
  {
    id: "sk-5",
    name: "Machine Learning & PyTorch",
    category: "Programming",
    description:
      "Supervised learning, deep neural nets, and PyTorch optimization.",
    level: "Advanced",
  },
  {
    id: "sk-6",
    name: "Conversational French",
    category: "Languages",
    description: "Grammar fundamentals, pronunciation, and everyday fluency.",
    level: "Advanced",
  },
  {
    id: "sk-7",
    name: "Statistical Analysis & R",
    category: "Academics",
    description:
      "Hypothesis testing, regression modeling, and academic papers.",
    level: "Expert",
  },
  {
    id: "sk-8",
    name: "Classical & Acoustic Guitar",
    category: "Music",
    description:
      "Fingerstyle techniques, rhythm accompaniment, and music theory.",
    level: "Intermediate",
  },
  {
    id: "sk-9",
    name: "Ceramic Sculpting & Pottery",
    category: "Crafts",
    description: "Hand-building, wheel throwing basics, and glaze formulation.",
    level: "Intermediate",
  },
];

export const MENTORS: Mentor[] = [
  {
    id: "2",
    name: "Alexandre Mercier",
    title: "Interaction & Visual Design Student",
    university: "National Institute of Design / MIT",
    city: "Bangalore",
    avatarInitials: "AM",
    bio: "Final-year design student focused on design systems, typography hierarchy, and micro-interactions. Mentored 30+ students on crafting portfolios.",
    teaches: [
      {
        id: "sk-4",
        name: "UI/UX Design in Figma",
        category: "Design",
        description:
          "Design systems, auto-layout, wireframes, and interactive prototypes.",
        level: "Expert",
      },
      {
        id: "sk-10",
        name: "Typography & Layout",
        category: "Design",
        description:
          "Editorial hierarchies and pairing serif with modern sans-serif fonts.",
        level: "Advanced",
      },
    ],
    wantsToLearn: [
      {
        id: "sk-1",
        name: "React & Next.js",
        category: "Programming",
        description:
          "Translating design mockups into responsive interactive components.",
        level: "Beginner",
      },
    ],
    rating: 5.0,
    reviewCount: 24,
    sessionCount: 32,
    availability: "Tue, Thu, Sat (After 5 PM)",
    languages: ["English", "French"],
    hourlyCredits: 1,
    featured: true,
    reviews: [
      {
        id: "rev-1",
        authorName: "Camille Laurent",
        authorUniversity: "Harvard University",
        rating: 5,
        comment:
          "Alexandre's design feedback elevated my project aesthetics tremendously. His guidance on typography and whitespace is pure gold.",
        date: "8 October 2026",
      },
      {
        id: "rev-2",
        authorName: "Priya Nair",
        authorUniversity: "IIT Bombay",
        rating: 5,
        comment:
          "Very patient mentor! Helped me structure my UX case study from start to finish.",
        date: "25 September 2026",
      },
    ],
  },
  {
    id: "3",
    name: "Priya Nair",
    title: "AI & Data Science Researcher",
    university: "Indian Institute of Technology, Bombay",
    city: "Mumbai",
    avatarInitials: "PN",
    bio: "Researcher working on deep learning, computer vision, and PyTorch model optimization. Love teaching complex mathematical concepts with intuitive visuals.",
    teaches: [
      {
        id: "sk-5",
        name: "Machine Learning & PyTorch",
        category: "Programming",
        description:
          "Supervised learning, deep neural nets, and PyTorch optimization.",
        level: "Advanced",
      },
      {
        id: "sk-11",
        name: "Python Data Science",
        category: "Programming",
        description: "Pandas, NumPy, and exploratory data analytics.",
        level: "Expert",
      },
    ],
    wantsToLearn: [
      {
        id: "sk-6",
        name: "Conversational French",
        category: "Languages",
        description: "Preparing for a summer European research residency.",
        level: "Beginner",
      },
    ],
    rating: 4.9,
    reviewCount: 14,
    sessionCount: 19,
    availability: "Weekends (10 AM - 4 PM)",
    languages: ["English", "Hindi", "Malayalam"],
    hourlyCredits: 1,
    featured: true,
    reviews: [
      {
        id: "rev-3",
        authorName: "Rohan Mehta",
        authorUniversity: "DTU Delhi",
        rating: 5,
        comment:
          "Priya explains backpropagation and gradient descent so clearly. Excellent mentor!",
        date: "2 October 2026",
      },
    ],
  },
  {
    id: "4",
    name: "Rohan Mehta",
    title: "Software Engineering Senior",
    university: "Delhi Technological University",
    city: "New Delhi",
    avatarInitials: "RM",
    bio: "Competitive programmer and backend specialist. Passionate about algorithms, low-level design, and high-performance Java APIs.",
    teaches: [
      {
        id: "sk-3",
        name: "Data Structures & Algorithms",
        category: "Programming",
        description:
          "Graph traversals, dynamic programming, and interview patterns.",
        level: "Expert",
      },
      {
        id: "sk-2",
        name: "Java Spring Boot",
        category: "Programming",
        description:
          "Enterprise backend architecture with JPA, Security, and REST APIs.",
        level: "Advanced",
      },
    ],
    wantsToLearn: [
      {
        id: "sk-4",
        name: "UI/UX Design in Figma",
        category: "Design",
        description:
          "Want to design sleek UI dashboards for my backend services.",
        level: "Beginner",
      },
    ],
    rating: 4.95,
    reviewCount: 21,
    sessionCount: 28,
    availability: "Mon, Thu, Sun (Evenings)",
    languages: ["English", "Hindi"],
    hourlyCredits: 1,
    featured: true,
    reviews: [
      {
        id: "rev-4",
        authorName: "Camille Laurent",
        authorUniversity: "Harvard University",
        rating: 5,
        comment:
          "Rohan's algorithm session demystified dynamic programming patterns for me. Brilliant teaching style!",
        date: "14 September 2026",
      },
    ],
  },
  {
    id: "5",
    name: "Elena Rostova",
    title: "PhD Fellow in Applied Statistics",
    university: "University of Cambridge",
    city: "Cambridge",
    avatarInitials: "ER",
    bio: "PhD researcher helping undergraduate students structure academic research papers, thesis arguments, and experimental statistical tests in R and Python.",
    teaches: [
      {
        id: "sk-7",
        name: "Statistical Analysis & R",
        category: "Academics",
        description:
          "Hypothesis testing, regression modeling, and academic papers.",
        level: "Expert",
      },
    ],
    wantsToLearn: [
      {
        id: "sk-6",
        name: "Conversational French",
        category: "Languages",
        description:
          "Polishing conversational French for academic conferences.",
        level: "Intermediate",
      },
    ],
    rating: 4.9,
    reviewCount: 11,
    sessionCount: 15,
    availability: "Wed, Fri, Sun (After 4 PM)",
    languages: ["English", "Russian", "French"],
    hourlyCredits: 1,
    featured: true,
    reviews: [
      {
        id: "rev-5",
        authorName: "Sara Khan",
        authorUniversity: "BITS Pilani",
        rating: 5,
        comment:
          "Elena helped me format my thesis data analysis with publication-ready charts. Invaluable session!",
        date: "28 August 2026",
      },
    ],
  },
  {
    id: "6",
    name: "Lucas Dubois",
    title: "Audio Engineering Student",
    university: "Sorbonne University",
    city: "Paris",
    avatarInitials: "LD",
    bio: "Classical guitar player and Ableton Live audio producer. Teaching fingerstyle techniques, harmony, and modern digital track mixing.",
    teaches: [
      {
        id: "sk-8",
        name: "Classical & Acoustic Guitar",
        category: "Music",
        description:
          "Fingerstyle techniques, rhythm accompaniment, and music theory.",
        level: "Advanced",
      },
    ],
    wantsToLearn: [
      {
        id: "sk-1",
        name: "React & Next.js",
        category: "Programming",
        description: "Building an audio visualizer portfolio for my tracks.",
        level: "Beginner",
      },
    ],
    rating: 4.8,
    reviewCount: 9,
    sessionCount: 12,
    availability: "Tue, Thu, Sat (3 PM - 7 PM)",
    languages: ["English", "French", "Spanish"],
    hourlyCredits: 1,
    featured: true,
    reviews: [
      {
        id: "rev-6",
        authorName: "Alexandre Mercier",
        authorUniversity: "MIT",
        rating: 5,
        comment:
          "Lucas is super chill and taught me three fingerpicking chords in our first hour together.",
        date: "12 August 2026",
      },
    ],
  },
];

export const CURRENT_PROFILE: StudentProfile = {
  id: "1",
  name: "Camille Laurent",
  email: "camille.laurent@harvard.edu",
  university: "Harvard University / BITS Pilani",
  college: "Harvard University / BITS Pilani",
  program: "Computer Science & Engineering",
  department: "Computer Science & Engineering",
  year: "3rd Year",
  bio: "3rd-year CS student passionate about full-stack web development, distributed systems, and clean UI engineering. Experienced with TypeScript, React, and Java.",
  avatarInitials: "CL",
  credits: 14,
  skillsOffered: [
    {
      id: "sk-1",
      name: "React & Next.js",
      category: "Programming",
      description: "Component architecture, hooks, and clean UI engineering.",
      level: "Advanced",
    },
    {
      id: "sk-2",
      name: "Java Spring Boot",
      category: "Programming",
      description:
        "Enterprise backend architecture with JPA, Security, and REST APIs.",
      level: "Advanced",
    },
  ],
  skillsWanted: [
    {
      id: "sk-4",
      name: "UI/UX Design in Figma",
      category: "Design",
      description: "Wanting to master wireframing and Figma auto-layout.",
      level: "Beginner",
    },
    {
      id: "sk-12",
      name: "Rust Systems Programming",
      category: "Programming",
      description: "Excited to learn systems programming in Rust.",
      level: "Beginner",
    },
  ],
  joinedAt: "September 2025",
};

export const SESSION_REQUESTS: SessionRequest[] = [
  {
    id: "req-1",
    mentorId: "2",
    mentorName: "Alexandre Mercier",
    skillName: "UI/UX Design in Figma",
    message:
      "Learn design systems and responsive token layouts for student portfolio.",
    proposedDate: "Saturday at 4:00 PM",
    status: "Accepted",
    direction: "Sent",
    createdAt: "12 October 2026",
  },
  {
    id: "req-2",
    mentorId: "4",
    mentorName: "Rohan Mehta",
    skillName: "React & Next.js",
    message:
      "Need assistance building frontend state management for an open-source project.",
    proposedDate: "Sunday at 6:00 PM",
    status: "Pending",
    direction: "Received",
    createdAt: "11 October 2026",
  },
  {
    id: "req-3",
    mentorId: "3",
    mentorName: "Priya Nair",
    skillName: "Java Spring Boot",
    message: "Configured JWT security filters and verified role authorization.",
    proposedDate: "Last Wednesday",
    status: "Completed",
    direction: "Received",
    createdAt: "5 October 2026",
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1-2",
    participantName: "Alexandre Mercier",
    participantInitials: "AM",
    participantUniversity: "National Institute of Design / MIT",
    subject: "Figma Prototyping Workshop",
    lastActive: "10:30 AM",
    unreadCount: 0,
    messages: [
      {
        id: "msg-1",
        conversationId: "conv-1-2",
        sender: "them",
        text: "Hi Camille! Looking forward to our Saturday Figma session. Have your project wireframes ready!",
        timestamp: "10:15 AM",
        read: true,
      },
      {
        id: "msg-2",
        conversationId: "conv-1-2",
        sender: "me",
        text: "Thanks Alexandre! I have the component structure ready in my sketch pad. See you Saturday at 4 PM!",
        timestamp: "10:30 AM",
        read: true,
      },
    ],
  },
  {
    id: "conv-1-4",
    participantName: "Rohan Mehta",
    participantInitials: "RM",
    participantUniversity: "Delhi Technological University",
    subject: "DSA & React Exchange",
    lastActive: "Yesterday",
    unreadCount: 1,
    messages: [
      {
        id: "msg-3",
        conversationId: "conv-1-4",
        sender: "them",
        text: "Hey Camille, saw your profile on the explore page. Would love to swap some DSA tips for React frontend tips!",
        timestamp: "Yesterday",
        read: false,
      },
    ],
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "p-1",
    authorName: "Camille Laurent",
    authorInitials: "CL",
    authorUniversity: "Harvard University",
    category: "Programming",
    postType: "project",
    title:
      "Built a Real-time Student Collaboration Canvas with React & TypeScript",
    body: "Just completed a major milestone on our campus project. Learned a ton about performant DOM rendering, responsive CSS grids, and clean component isolation. What state management pattern do you recommend for canvas tools?",
    likes: 42,
    replies: 14,
    postedAt: "2 hours ago",
    tags: ["React", "TypeScript", "FullStack"],
    imageUrl: "/assets/generated/community-react.dim_1200x675.jpg",
  },
  {
    id: "p-2",
    authorName: "Alexandre Mercier",
    authorInitials: "AM",
    authorUniversity: "MIT",
    category: "Design",
    postType: "project",
    title: "Typography & Whitespace: The Subtle Art of Academic Elegance",
    body: "Sharing a comprehensive visual breakdown of how serif headings pair with minimalist sans-serif body text for modern academic software interfaces. Check out the hierarchy rules and token guidelines!",
    likes: 87,
    replies: 31,
    postedAt: "Yesterday",
    tags: ["Design", "Typography", "Figma"],
    imageUrl: "/assets/generated/community-typo.dim_1200x675.jpg",
  },
  {
    id: "p-3",
    authorName: "Priya Nair",
    authorInitials: "PN",
    authorUniversity: "IIT Bombay",
    category: "Programming",
    postType: "achievement",
    title:
      "Beginner's Guide to Fine-Tuning Lightweight Neural Networks on a Laptop",
    body: "Many students asked how to train machine learning models without expensive GPU cloud instances. Here is my curated list of quantized models, parameter-efficient fine-tuning (PEFT), and free Colab environments.",
    likes: 112,
    replies: 45,
    postedAt: "3 days ago",
    tags: ["AI", "MachineLearning", "Python"],
  },
  {
    id: "p-4",
    authorName: "Lucas Dubois",
    authorInitials: "LD",
    authorUniversity: "Sorbonne University",
    category: "Music",
    postType: "project",
    title: "How Playing an Instrument Enhances Algorithmic Thinking",
    body: "Polyphonic rhythm and counterpoint in classical music share deep structural mathematical beauty with recursive algorithms. Starting an informal acoustic guitar jam session this Friday!",
    likes: 35,
    replies: 12,
    postedAt: "5 days ago",
    tags: ["Music", "Guitar", "Creativity"],
    imageUrl: "/assets/generated/community-music.dim_1200x675.jpg",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "SkillSwap gave me access to high-caliber peer mentoring right on campus. I taught frontend styling and received personalized algorithm coaching that helped me land my summer tech internship.",
    authorName: "Camille Laurent",
    authorRole: "Computer Science Senior",
    authorUniversity: "Harvard University / BITS Pilani",
  },
  {
    id: "t-2",
    quote:
      "The 1 hour taught = 1 hour learned model makes peer learning equitable and fun. No money changes hands, just pure passion and collaborative spirit.",
    authorName: "Alexandre Mercier",
    authorRole: "Interaction Design Student",
    authorUniversity: "National Institute of Design / MIT",
  },
  {
    id: "t-3",
    quote:
      "As a researcher, sharing data science techniques with enthusiastic juniors reinforced my own foundational understanding. It's the best academic exchange platform I've used.",
    authorName: "Priya Nair",
    authorRole: "AI Graduate Scholar",
    authorUniversity: "Indian Institute of Technology, Bombay",
  },
];
