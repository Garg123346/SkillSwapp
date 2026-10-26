import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { CommunityPost, SkillCategory } from "@/lib/types";
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  ImagePlus,
  MessageCircle,
  PenLine,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type PostType = "all" | "project" | "question" | "achievement";

const POST_TYPES: {
  value: "project" | "question" | "achievement";
  label: string;
  icon: typeof Sparkles;
}[] = [
  { value: "project", label: "Projects", icon: Sparkles },
  { value: "question", label: "Questions", icon: MessageCircle },
  { value: "achievement", label: "Achievements", icon: Trophy },
];

const CATEGORY_ORDER: SkillCategory[] = [
  "Programming",
  "Design",
  "Languages",
  "Music",
  "Academics",
  "Crafts",
];

const PROJECT_IMAGES: Record<string, string> = {
  "p-1": "/assets/generated/community-react.dim_1200x675.jpg",
  "p-2": "/assets/generated/community-typo.dim_1200x675.jpg",
  "p-4": "/assets/generated/community-ceramics.dim_1200x675.jpg",
  "p-6": "/assets/generated/community-music.dim_1200x675.jpg",
};

function getPostType(
  post: CommunityPost,
): "project" | "question" | "achievement" {
  if (post.replies >= 30) return "question";
  if (post.likes >= 90) return "achievement";
  return "project";
}

function PostCard({
  post,
  index,
  liked,
  bookmarked,
  onToggleLike,
  onToggleBookmark,
}: {
  post: CommunityPost;
  index: number;
  liked: boolean;
  bookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
}) {
  const image = post.imageUrl ?? PROJECT_IMAGES[post.id];
  const type = getPostType(post);
  const typeLabel =
    POST_TYPES.find((entry) => entry.value === type)?.label ?? "Projects";

  return (
    <article
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-subtle transition-smooth hover:border-accent/50 hover:shadow-elevated"
      data-ocid={`community.item.${index + 1}`}
    >
      {image ? (
        <div className="aspect-[16/9] overflow-hidden border-b border-border bg-muted">
          <img
            src={image}
            alt={`Project preview: ${post.title}`}
            loading="lazy"
            className="size-full object-cover transition-smooth group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-base font-semibold text-secondary-foreground">
            {post.authorInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold tracking-tight text-foreground">
              {post.authorName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {post.authorUniversity}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
            {typeLabel}
          </span>
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
          {post.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {post.body}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">{post.postedAt}</p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleLike}
              aria-pressed={liked}
              aria-label={liked ? `Unlike ${post.title}` : `Like ${post.title}`}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                liked
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              data-ocid={`community.toggle.${index + 1}`}
            >
              <Heart
                className={`size-4 ${liked ? "fill-primary text-primary" : ""}`}
                aria-hidden="true"
              />
              <span className="font-mono">{post.likes}</span>
            </button>

            <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4" aria-hidden="true" />
              <span className="font-mono">{post.replies}</span>
            </span>

            <button
              type="button"
              onClick={onToggleBookmark}
              aria-pressed={bookmarked}
              aria-label={
                bookmarked
                  ? `Remove ${post.title} from bookmarks`
                  : `Bookmark ${post.title}`
              }
              className={`inline-flex size-9 items-center justify-center rounded-full transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                bookmarked
                  ? "bg-accent/15 text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              data-ocid={`community.toggle.${index + 1}`}
            >
              {bookmarked ? (
                <BookmarkCheck className="size-4" aria-hidden="true" />
              ) : (
                <Bookmark className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CommunityPage() {
  const { posts, addPost, likePost, profile } = useStore();

  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<PostType>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<SkillCategory>("Programming");
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  const toggleLike = (id: string) => {
    setLikedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
    likePost(id);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const filtered = useMemo(
    () =>
      activeType === "all"
        ? posts
        : posts.filter((post) => getPostType(post) === activeType),
    [posts, activeType],
  );

  const saved = useMemo(
    () => posts.filter((post) => bookmarkedIds.includes(post.id)),
    [posts, bookmarkedIds],
  );

  const resetForm = () => {
    setTitle("");
    setBody("");
    setCategory("Programming");
    setImageUrl("");
    setFormError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length === 0 || body.trim().length === 0) {
      setFormError("Both title and content are required.");
      return;
    }
    addPost({
      authorName: profile.name || "Alexandre Chen",
      authorInitials: profile.avatarInitials || "AC",
      authorUniversity: profile.university || "Harvard University",
      category,
      title: title.trim(),
      body: body.trim(),
      tags: [category, "Community"],
      imageUrl: imageUrl.trim().length > 0 ? imageUrl.trim() : undefined,
    });
    resetForm();
    setIsCreateOpen(false);
  };

  return (
    <div data-ocid="community.page">
      <section className="border-b border-border bg-background">
        <div className="container py-12 md:py-16">
          <p className="label-eyebrow">Campus Knowledge Exchange</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Student Community Feed
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore collaborative projects, ask study questions, and celebrate
            achievements with fellow university students.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              data-ocid="community.open_modal_button"
            >
              <PenLine className="size-4 mr-2" aria-hidden="true" />
              Create Post
            </Button>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">
                {posts.length}
              </span>{" "}
              publications
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background" data-ocid="community.section">
        <div className="container py-12 md:py-16">
          <Tabs defaultValue="feed">
            <TabsList className="h-11 bg-muted p-1">
              <TabsTrigger
                value="feed"
                className="h-9 px-5"
                data-ocid="community.tab"
              >
                Campus Feed
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="h-9 px-5"
                data-ocid="community.tab"
              >
                Saved Posts
                {saved.length > 0 ? (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 font-mono text-xs text-primary-foreground">
                    {saved.length}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveType("all")}
                  aria-pressed={activeType === "all"}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    activeType === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/10"
                  }`}
                  data-ocid="community.filter.tab"
                >
                  All
                </button>
                {POST_TYPES.map((entry) => {
                  const Icon = entry.icon;
                  const active = activeType === entry.value;
                  return (
                    <button
                      key={entry.value}
                      type="button"
                      onClick={() => setActiveType(entry.value)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/10"
                      }`}
                      data-ocid="community.filter.tab"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {entry.label}
                    </button>
                  );
                })}
              </div>

              {filtered.length > 0 ? (
                <div
                  className="mt-8 grid gap-6 lg:grid-cols-2"
                  data-ocid="community.list"
                >
                  {filtered.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={index}
                      liked={likedIds.includes(post.id)}
                      bookmarked={bookmarkedIds.includes(post.id)}
                      onToggleLike={() => toggleLike(post.id)}
                      onToggleBookmark={() => toggleBookmark(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
                  data-ocid="community.empty_state"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Sparkles className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
                    No posts in this category
                  </h2>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    Be the first student to share a project, ask a question, or
                    celebrate a milestone with peers!
                  </p>
                  <Button
                    type="button"
                    className="mt-8"
                    onClick={() => setIsCreateOpen(true)}
                    data-ocid="community.primary_button"
                  >
                    <PenLine className="size-4 mr-2" aria-hidden="true" />
                    Create Post
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="mt-8">
              {saved.length > 0 ? (
                <div
                  className="grid gap-6 lg:grid-cols-2"
                  data-ocid="community.list"
                >
                  {saved.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={index}
                      liked={likedIds.includes(post.id)}
                      bookmarked
                      onToggleLike={() => toggleLike(post.id)}
                      onToggleBookmark={() => toggleBookmark(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
                  data-ocid="community.empty_state"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Bookmark className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
                    No saved posts yet
                  </h2>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    Click the bookmark icon on any post to save it for quick
                    reference later.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-xl" data-ocid="community.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Create a Community Post
            </DialogTitle>
            <DialogDescription>
              Share a project, ask for advice, or celebrate an academic
              milestone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="post-title">Post Title</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your post a concise title"
                data-ocid="community.input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="post-body">Content</Label>
              <Textarea
                id="post-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Describe what you built, what you need help with, or what you achieved..."
                rows={5}
                data-ocid="community.textarea"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="post-category">Category</Label>
              <select
                id="post-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as SkillCategory)
                }
                className="h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-smooth focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                data-ocid="community.select"
              >
                {CATEGORY_ORDER.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="post-image">Project Image URL (optional)</Label>
              <div className="relative">
                <ImagePlus
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="post-image"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://..."
                  className="pl-10"
                  data-ocid="community.input"
                />
              </div>
            </div>

            {formError.length > 0 ? (
              <p
                className="flex items-center gap-2 text-sm font-medium text-destructive"
                data-ocid="community.error_state"
              >
                <X className="size-4" aria-hidden="true" />
                {formError}
              </p>
            ) : null}

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreateOpen(false);
                }}
                data-ocid="community.cancel_button"
              >
                Cancel
              </Button>
              <Button type="submit" data-ocid="community.submit_button">
                Publish Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
