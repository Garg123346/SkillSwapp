export type SkillCategory =
  | "Programming"
  | "Design"
  | "Languages"
  | "Music"
  | "Academics"
  | "Crafts"
  // Backward compatibility aliases
  | "Programmation"
  | "Langues"
  | "Musique"
  | "Académique"
  | "Artisanat";

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  // Backward compatibility aliases
  | "Débutant"
  | "Intermédiaire"
  | "Avancé";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  level: SkillLevel;
}

export interface Review {
  id: string;
  authorName: string;
  authorUniversity: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  university: string;
  city: string;
  avatarInitials: string;
  bio: string;
  teaches: Skill[];
  wantsToLearn: Skill[];
  rating: number;
  reviewCount: number;
  sessionCount: number;
  availability: string;
  languages: string[];
  hourlyCredits: number;
  featured: boolean;
  reviews: Review[];
}

export type SessionRequestStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Declined"
  | "Completed"
  | "Cancelled"
  // Backward compatibility aliases
  | "En attente"
  | "Acceptée"
  | "Refusée"
  | "Terminée";

export type SessionRequestDirection =
  | "Sent"
  | "Received"
  // Backward compatibility aliases
  | "Envoyée"
  | "Reçue";

export interface SessionRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  skillName: string;
  message: string;
  proposedDate: string;
  status: SessionRequestStatus;
  direction: SessionRequestDirection;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId?: string;
  participantName: string;
  participantInitials: string;
  participantUniversity: string;
  subject: string;
  lastActive: string;
  unreadCount: number;
  messages: Message[];
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorInitials: string;
  authorUniversity: string;
  category: SkillCategory;
  title: string;
  body: string;
  likes: number;
  replies: number;
  postedAt: string;
  tags: string[];
  imageUrl?: string;
  postType?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  college?: string;
  program: string;
  department?: string;
  year: string;
  bio: string;
  avatarInitials: string;
  credits: number;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  joinedAt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorUniversity: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  profile: StudentProfile | null;
}
