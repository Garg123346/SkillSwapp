import type {
  CommunityPost,
  Conversation,
  Mentor,
  Message,
  SessionRequest,
  Skill,
  SkillCategory,
  StudentProfile,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("skillswap_token");
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("skillswap_token", token);
  } else {
    localStorage.removeItem("skillswap_token");
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const data = await request<{
      token: string;
      tokenType: string;
      user: StudentProfile;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    college?: string;
    department?: string;
    studyYear?: string;
    bio?: string;
  }) {
    const data = await request<{
      token: string;
      tokenType: string;
      user: StudentProfile;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(params),
    });
    setToken(data.token);
    return data;
  },

  async getCurrentUser() {
    return request<StudentProfile>("/auth/me");
  },

  async updateProfile(updates: Partial<StudentProfile>) {
    return request<StudentProfile>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  logout() {
    setToken(null);
  },

  // Mentors
  async getMentors(params?: {
    category?: string;
    level?: string;
    sort?: string;
    q?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "All")
      query.append("category", params.category);
    if (params?.level && params.level !== "All")
      query.append("level", params.level);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.q) query.append("q", params.q);

    const queryString = query.toString();
    return request<Mentor[]>(`/mentors${queryString ? `?${queryString}` : ""}`);
  },

  async getMentorById(id: string) {
    return request<Mentor>(`/mentors/${id}`);
  },

  // Skills
  async getAllSkills(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return request<Skill[]>(`/skills${query}`);
  },

  async getUserSkills(type: "OFFERED" | "WANTED" = "OFFERED") {
    return request<Skill[]>(`/skills/user?type=${type}`);
  },

  async addUserSkill(skill: {
    name: string;
    category: SkillCategory;
    level: Skill["level"];
    description?: string;
    skillType?: "OFFERED" | "WANTED";
  }) {
    return request<Skill>("/skills/user", {
      method: "POST",
      body: JSON.stringify(skill),
    });
  },

  async removeUserSkill(skillId: string, type: "OFFERED" | "WANTED") {
    return request<void>(`/skills/user/${skillId}?type=${type}`, {
      method: "DELETE",
    });
  },

  // Requests
  async getRequests() {
    return request<SessionRequest[]>("/requests");
  },

  async createRequest(data: {
    mentorId: string | number;
    skillName: string;
    proposedDate: string;
    message: string;
  }) {
    return request<SessionRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateRequestStatus(id: string, status: SessionRequest["status"]) {
    return request<SessionRequest>(`/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Conversations & Messages
  async getConversations() {
    return request<Conversation[]>("/conversations");
  },

  async getMessages(conversationId: string) {
    return request<Message[]>(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(receiverId: string | number, text: string) {
    return request<Message>("/messages", {
      method: "POST",
      body: JSON.stringify({ receiverId, text }),
    });
  },

  async markConversationRead(conversationId: string) {
    return request<void>(`/conversations/${conversationId}/read`, {
      method: "POST",
    });
  },

  // Reviews
  async getMentorReviews(mentorId: string | number) {
    return request<Mentor["reviews"]>(`/reviews/mentor/${mentorId}`);
  },

  async addReview(data: {
    mentorId: string | number;
    rating: number;
    comment: string;
    sessionRequestId?: string | number;
  }) {
    return request<Mentor["reviews"][0]>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Community Posts
  async getPosts(category?: string, type?: string) {
    const query = new URLSearchParams();
    if (category && category !== "All") query.append("category", category);
    if (type && type !== "all") query.append("type", type);
    const qs = query.toString();
    return request<CommunityPost[]>(`/posts${qs ? `?${qs}` : ""}`);
  },

  async createPost(data: {
    title: string;
    body: string;
    category: SkillCategory;
    postType?: string;
    tags?: string[];
    imageUrl?: string;
  }) {
    return request<CommunityPost>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deletePost(id: string | number) {
    return request<void>(`/posts/${id}`, {
      method: "DELETE",
    });
  },

  async toggleLike(id: string | number) {
    return request<{ liked: boolean; likesCount: number }>(
      `/posts/${id}/like`,
      {
        method: "POST",
      },
    );
  },

  async toggleBookmark(id: string | number) {
    return request<{ bookmarked: boolean }>(`/posts/${id}/bookmark`, {
      method: "POST",
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    return request<any>("/dashboard/stats");
  },
};
