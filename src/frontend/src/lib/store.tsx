import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setToken } from "./api";
import {
  COMMUNITY_POSTS,
  CONVERSATIONS,
  CURRENT_PROFILE,
  MENTORS,
  SESSION_REQUESTS,
  SKILLS,
} from "./mock-data";
import type {
  CommunityPost,
  Conversation,
  Mentor,
  Message,
  SessionRequest,
  Skill,
  StudentProfile,
} from "./types";

interface StoreValue {
  mentors: Mentor[];
  skills: Skill[];
  requests: SessionRequest[];
  conversations: Conversation[];
  posts: CommunityPost[];
  profile: StudentProfile;
  isAuthenticated: boolean;
  currentUserName: string;
  isLoading: boolean;
  getMentor: (id: string) => Mentor | undefined;
  login: (emailOrName?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addRequest: (
    request: Omit<SessionRequest, "id" | "createdAt">,
  ) => Promise<void>;
  updateRequestStatus: (
    id: string,
    status: SessionRequest["status"],
  ) => Promise<void>;
  sendMessage: (receiverOrConvId: string, text: string) => Promise<void>;
  markConversationRead: (conversationId: string) => Promise<void>;
  addPost: (
    post: Omit<CommunityPost, "id" | "likes" | "replies" | "postedAt">,
  ) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [mentors, setMentors] = useState<Mentor[]>(MENTORS);
  const [skills, _setSkills] = useState<Skill[]>(SKILLS);
  const [requests, setRequests] = useState<SessionRequest[]>(SESSION_REQUESTS);
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [profile, setProfile] = useState<StudentProfile>(CURRENT_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("skillswap_token"));
  });
  const [currentUserName, setCurrentUserName] = useState<string>(
    CURRENT_PROFILE.name,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync with backend on startup
  const refreshData = useCallback(async () => {
    try {
      // 1. Fetch mentors
      const remoteMentors = await api.getMentors();
      if (remoteMentors && remoteMentors.length > 0) {
        setMentors(remoteMentors);
      }
    } catch {
      // Keep mock data on connection failure
    }

    try {
      // 2. Fetch community posts
      const remotePosts = await api.getPosts();
      if (remotePosts && remotePosts.length > 0) {
        setPosts(remotePosts);
      }
    } catch {
      // Keep mock data
    }

    // 3. If authenticated, fetch profile, requests & conversations
    if (localStorage.getItem("skillswap_token")) {
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setProfile(user);
          setCurrentUserName(user.name);
          setIsAuthenticated(true);
        }

        const remoteRequests = await api.getRequests();
        if (remoteRequests && remoteRequests.length > 0) {
          setRequests(remoteRequests);
        }

        const remoteConversations = await api.getConversations();
        if (remoteConversations && remoteConversations.length > 0) {
          setConversations(remoteConversations);
        }
      } catch {
        // Fallback gracefully
      }
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getMentor = useCallback(
    (id: string) => mentors.find((mentor) => String(mentor.id) === String(id)),
    [mentors],
  );

  const login = useCallback(
    async (emailOrName?: string, password?: string) => {
      setIsLoading(true);
      try {
        const email = emailOrName?.includes("@")
          ? emailOrName
          : "camille.laurent@harvard.edu";
        const pwd = password || "SkillSwap2026";

        const res = await api.login(email, pwd);
        if (res?.user) {
          setProfile(res.user);
          setCurrentUserName(res.user.name);
          setIsAuthenticated(true);
          await refreshData();
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn(
          "Backend auth failed or unreachable, using local session:",
          err,
        );
      }

      // Local fallback
      setIsAuthenticated(true);
      const name =
        emailOrName && emailOrName.trim().length > 0
          ? emailOrName
          : CURRENT_PROFILE.name;
      setCurrentUserName(name);
      setIsLoading(false);
      return true;
    },
    [refreshData],
  );

  const logout = useCallback(() => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUserName("");
  }, []);

  const addRequest = useCallback(
    async (request: Omit<SessionRequest, "id" | "createdAt">) => {
      const localId = `req-${Date.now()}`;
      const nowStr = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const newReq: SessionRequest = {
        ...request,
        id: localId,
        createdAt: nowStr,
      };

      // Optimistic update
      setRequests((current) => [newReq, ...current]);

      try {
        const created = await api.createRequest({
          mentorId: request.mentorId,
          skillName: request.skillName,
          proposedDate: request.proposedDate,
          message: request.message,
        });
        if (created) {
          setRequests((current) =>
            current.map((r) => (r.id === localId ? created : r)),
          );
        }
      } catch (err) {
        console.warn("Could not sync request to backend:", err);
      }
    },
    [],
  );

  const updateRequestStatus = useCallback(
    async (id: string, status: SessionRequest["status"]) => {
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request,
        ),
      );

      try {
        await api.updateRequestStatus(id, status);
      } catch (err) {
        console.warn("Could not sync request status to backend:", err);
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (conversationOrReceiverId: string, text: string) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return;

      const timeStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const localMsg: Message = {
        id: `msg-${Date.now()}`,
        conversationId: conversationOrReceiverId,
        sender: "me",
        text: trimmed,
        timestamp: timeStr,
        read: true,
      };

      setConversations((current) =>
        current.map((conv) => {
          if (
            conv.id !== conversationOrReceiverId &&
            conv.participantId !== conversationOrReceiverId
          )
            return conv;

          return {
            ...conv,
            messages: [...conv.messages, localMsg],
            lastActive: "Just now",
          };
        }),
      );

      try {
        await api.sendMessage(conversationOrReceiverId, trimmed);
      } catch (err) {
        console.warn("Could not sync message to backend:", err);
      }
    },
    [],
  );

  const markConversationRead = useCallback(async (conversationId: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
              messages: conversation.messages.map((message) => ({
                ...message,
                read: true,
              })),
            }
          : conversation,
      ),
    );

    try {
      await api.markConversationRead(conversationId);
    } catch {
      // ignore
    }
  }, []);

  const addPost = useCallback(
    async (
      post: Omit<CommunityPost, "id" | "likes" | "replies" | "postedAt">,
    ) => {
      const localId = `p-${Date.now()}`;
      const newPost: CommunityPost = {
        ...post,
        id: localId,
        likes: 0,
        replies: 0,
        postedAt: "Just now",
      };

      setPosts((current) => [newPost, ...current]);

      try {
        const created = await api.createPost({
          title: post.title,
          body: post.body,
          category: post.category,
          tags: post.tags,
          imageUrl: post.imageUrl,
          postType: post.postType || "project",
        });
        if (created) {
          setPosts((current) =>
            current.map((p) => (p.id === localId ? created : p)),
          );
        }
      } catch (err) {
        console.warn("Could not sync post to backend:", err);
      }
    },
    [],
  );

  const likePost = useCallback(async (id: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post,
      ),
    );

    try {
      await api.toggleLike(id);
    } catch {
      // ignore
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<StudentProfile>) => {
      setProfile((current) => ({ ...current, ...updates }));

      try {
        const updated = await api.updateProfile(updates);
        if (updated) {
          setProfile(updated);
        }
      } catch {
        // ignore
      }
    },
    [],
  );

  const value = useMemo<StoreValue>(
    () => ({
      mentors,
      skills,
      requests,
      conversations,
      posts,
      profile,
      isAuthenticated,
      currentUserName,
      isLoading,
      getMentor,
      login,
      logout,
      addRequest,
      updateRequestStatus,
      sendMessage,
      markConversationRead,
      addPost,
      likePost,
      updateProfile,
      refreshData,
    }),
    [
      mentors,
      skills,
      requests,
      conversations,
      posts,
      profile,
      isAuthenticated,
      currentUserName,
      isLoading,
      getMentor,
      login,
      logout,
      addRequest,
      updateRequestStatus,
      sendMessage,
      markConversationRead,
      addPost,
      likePost,
      updateProfile,
      refreshData,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
