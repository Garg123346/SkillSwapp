import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { SessionRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Clock,
  GraduationCap,
  Inbox,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Pending: "border-warning/40 bg-warning/10 text-warning",
  Accepted: "border-success/40 bg-success/10 text-success",
  Rejected: "border-destructive/40 bg-destructive/10 text-destructive",
  Completed: "border-border bg-muted text-muted-foreground",
  "En attente": "border-warning/40 bg-warning/10 text-warning",
  Acceptée: "border-success/40 bg-success/10 text-success",
  Refusée: "border-destructive/40 bg-destructive/10 text-destructive",
  Terminée: "border-border bg-muted text-muted-foreground",
};

function formatFirstName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "Student";
  return trimmed.split(" ")[0];
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardPage() {
  const { profile, currentUserName, requests, mentors, conversations } =
    useStore();

  const displayName =
    currentUserName && currentUserName.trim().length > 0
      ? currentUserName
      : profile.name;

  const upcomingSessions = requests
    .filter(
      (request) =>
        request.status === "Accepted" ||
        request.status === "Pending" ||
        request.status === "Acceptée" ||
        request.status === "En attente",
    )
    .slice(0, 4);

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "Pending" || request.status === "En attente",
  );

  const wantedCategories = new Set(
    profile.skillsWanted.map((skill) => skill.category.toLowerCase()),
  );

  const recommendedMentors = mentors
    .filter((mentor) => String(mentor.id) !== String(profile.id))
    .filter(
      (mentor) =>
        wantedCategories.size === 0 ||
        mentor.teaches.some((skill) =>
          wantedCategories.has(skill.category.toLowerCase()),
        ),
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const totalHours = Math.max(4, requests.length * 2);
  const completedSessions = requests.filter(
    (request) =>
      request.status === "Completed" || request.status === "Terminée",
  ).length;

  const stats = [
    {
      id: "stat-sessions",
      label: "Upcoming Sessions",
      value: String(upcomingSessions.length),
      hint: "Confirmed & pending approval",
      icon: CalendarClock,
    },
    {
      id: "stat-hours",
      label: "Learning Hours",
      value: `${totalHours} hrs`,
      hint: "Accumulated this academic term",
      icon: Clock,
    },
    {
      id: "stat-teaching",
      label: "Skills Offered",
      value: String(profile.skillsOffered.length),
      hint: "Available for peer teaching",
      icon: GraduationCap,
    },
    {
      id: "stat-completed",
      label: "Completed Sessions",
      value: String(completedSessions),
      hint: "All-time peer exchanges",
      icon: TrendingUp,
    },
  ];

  const activity = [
    {
      id: "act-1",
      icon: MessageSquare,
      title: "New message from Alexandre Mercier",
      detail: "Figma Prototyping Workshop",
      time: "15 minutes ago",
    },
    {
      id: "act-2",
      icon: Inbox,
      title: "Session request received from Rohan Mehta",
      detail: "React & Next.js mentorship",
      time: "Yesterday",
    },
    {
      id: "act-3",
      icon: Sparkles,
      title: "Session confirmed with Alexandre Mercier",
      detail: "Saturday at 4:00 PM",
      time: "2 days ago",
    },
    {
      id: "act-4",
      icon: Star,
      title: "New 5-star review received",
      detail: "Rated 5.0 out of 5 for Java Spring Boot",
      time: "3 days ago",
    },
  ];

  return (
    <section className="container py-12 md:py-16" data-ocid="dashboard.page">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="label-eyebrow">Academic Dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Welcome, {formatFirstName(displayName)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Here is an overview of your active learning exchanges, upcoming
            sessions, and peer collaboration milestones.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild data-ocid="dashboard.explore_button">
            <Link to="/explore" search={{}}>
              Explore Mentors
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            data-ocid="dashboard.requests_button"
          >
            <Link to="/requests">Manage Requests</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className="gap-4 rounded-lg border-border py-5 shadow-subtle"
            data-ocid={`dashboard.${stat.id}`}
          >
            <CardContent className="flex items-start justify-between gap-4 px-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.hint}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <stat.icon className="size-5" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            className="gap-0 rounded-lg border-border py-0 shadow-subtle"
            data-ocid="dashboard.sessions_card"
          >
            <CardHeader className="border-b border-border px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-xl">
                    Upcoming Sessions
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Your scheduled peer mentoring exchanges
                  </CardDescription>
                </div>
                <CalendarClock
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {upcomingSessions.length === 0 ? (
                <div
                  className="flex flex-col items-center gap-3 px-6 py-12 text-center"
                  data-ocid="dashboard.sessions_empty_state"
                >
                  <CalendarClock
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="font-medium">No Sessions Scheduled</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Explore available student mentors and propose a session to
                    start exchanging knowledge.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    data-ocid="dashboard.sessions_empty_button"
                  >
                    <Link to="/explore" search={{}}>
                      Find a Mentor
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {upcomingSessions.map((session, index) => (
                    <li
                      key={session.id}
                      className="flex flex-col gap-3 px-6 py-4 transition-smooth hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                      data-ocid={`dashboard.session.item.${index + 1}`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                          {initialsOf(session.mentorName)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {session.mentorName}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {session.skillName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="size-4" aria-hidden="true" />
                          {session.proposedDate}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full",
                            STATUS_STYLES[session.status] ||
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card
            className="mt-8 gap-0 rounded-lg border-border py-0 shadow-subtle"
            data-ocid="dashboard.mentors_card"
          >
            <CardHeader className="border-b border-border px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-xl">
                    Recommended Mentors
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Matched based on the skills you want to learn
                  </CardDescription>
                </div>
                <Lightbulb
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <ul className="divide-y divide-border">
                {recommendedMentors.map((mentor, index) => (
                  <li key={mentor.id}>
                    <Link
                      to="/mentors/$id"
                      params={{ id: String(mentor.id) }}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-smooth hover:bg-muted/50"
                      data-ocid={`dashboard.mentor.item.${index + 1}`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {mentor.avatarInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{mentor.name}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {mentor.title} · {mentor.university}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="hidden items-center gap-1 text-sm font-medium sm:inline-flex">
                          <Star
                            className="size-4 fill-accent text-accent"
                            aria-hidden="true"
                          />
                          {Number(mentor.rating).toFixed(1)}
                        </span>
                        <ArrowRight
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card
            className="gap-0 rounded-lg border-border py-0 shadow-subtle"
            data-ocid="dashboard.pending_card"
          >
            <CardHeader className="border-b border-border px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="font-display text-xl">
                  Pending Requests
                </CardTitle>
                <Inbox
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5">
              {pendingRequests.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground"
                  data-ocid="dashboard.pending_empty_state"
                >
                  No pending session requests at the moment.
                </p>
              ) : (
                <>
                  <p className="font-display text-4xl font-semibold tracking-tight">
                    {pendingRequests.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pendingRequests.length > 1
                      ? "requests awaiting response"
                      : "request awaiting response"}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {pendingRequests.slice(0, 3).map((request) => (
                      <li
                        key={request.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 truncate text-muted-foreground">
                          {request.mentorName}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {request.direction}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full"
                    data-ocid="dashboard.pending_button"
                  >
                    <Link to="/requests">Manage Requests</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card
            className="gap-0 rounded-lg border-border py-0 shadow-subtle"
            data-ocid="dashboard.activity_card"
          >
            <CardHeader className="border-b border-border px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="font-display text-xl">
                  Recent Activity
                </CardTitle>
                <BookOpen
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <ul className="space-y-5">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <item.icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.detail} · {item.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted-foreground">
                {conversations.length} active peer conversations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
