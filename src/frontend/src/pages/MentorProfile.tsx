import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { Mentor, Review, Skill } from "@/lib/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Languages,
  MapPin,
  Send,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

const AVAILABILITY_SLOTS = [
  { day: "Monday", slots: ["6:00 PM", "7:00 PM", "8:00 PM"] },
  { day: "Tuesday", slots: ["6:00 PM", "7:00 PM", "8:00 PM"] },
  { day: "Wednesday", slots: ["6:00 PM", "7:00 PM", "8:00 PM"] },
  { day: "Thursday", slots: [] },
  { day: "Friday", slots: ["5:00 PM", "6:30 PM"] },
  { day: "Saturday", slots: ["11:00 AM", "2:00 PM", "4:00 PM"] },
  { day: "Sunday", slots: [] },
];

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "bg-muted text-muted-foreground",
  Intermediate: "bg-secondary/10 text-secondary",
  Advanced: "bg-primary/10 text-primary",
  Expert: "bg-accent/20 text-accent-foreground",
  Débutant: "bg-muted text-muted-foreground",
  Intermédiaire: "bg-secondary/10 text-secondary",
  Avancé: "bg-primary/10 text-primary",
};

function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className ?? ""}`}
      aria-label={`Rating ${Number(rating).toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`size-4 ${
            value <= Math.round(rating)
              ? "fill-accent text-accent"
              : "text-border"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li
      className="rounded-xl border border-border bg-card p-6 shadow-subtle"
      data-ocid="mentor.review_card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-foreground">
            {review.authorName}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {review.authorUniversity}
          </p>
        </div>
        <RatingStars rating={review.rating} className="shrink-0" />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {review.comment}
      </p>
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {review.date}
      </p>
    </li>
  );
}

interface RequestFormProps {
  mentor: Mentor;
  onSubmitted: () => void;
}

function RequestForm({ mentor, onSubmitted }: RequestFormProps) {
  const { addRequest } = useStore();
  const [skillName, setSkillName] = useState(mentor.teaches[0]?.name ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [goals, setGoals] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!skillName) next.skillName = "Please select a skill.";
    if (!date) next.date = "Please specify a preferred date.";
    if (!time) next.time = "Please specify a preferred time slot.";
    if (goals.trim().length < 10) {
      next.goals =
        "Describe your learning goals in a few sentences (at least 10 characters).";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addRequest({
      mentorId: String(mentor.id),
      mentorName: mentor.name,
      skillName,
      message: goals.trim(),
      proposedDate: `${date}, ${time}`,
      status: "Pending",
      direction: "Sent",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center py-6 text-center"
        data-ocid="mentor.success_state"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
          Session Request Sent
        </h3>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Your session request has been forwarded to {mentor.name}. You can
          track status updates anytime in your Learning Requests tab.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild data-ocid="mentor.primary_button">
            <Link to="/requests">View My Requests</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSubmitted}
            data-ocid="mentor.close_button"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="request-skill">Desired Skill</Label>
        <select
          id="request-skill"
          value={skillName}
          onChange={(event) => setSkillName(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-smooth focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          data-ocid="mentor.select"
        >
          {mentor.teaches.map((skill) => (
            <option key={skill.id || skill.name} value={skill.name}>
              {skill.name} ({skill.level})
            </option>
          ))}
        </select>
        {errors.skillName ? (
          <p
            className="text-sm text-destructive"
            data-ocid="mentor.error_state"
          >
            {errors.skillName}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="request-date">Preferred Date</Label>
          <Input
            id="request-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-invalid={Boolean(errors.date)}
            data-ocid="mentor.input"
          />
          {errors.date ? (
            <p
              className="text-sm text-destructive"
              data-ocid="mentor.error_state"
            >
              {errors.date}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="request-time">Time Slot</Label>
          <Input
            id="request-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            aria-invalid={Boolean(errors.time)}
            data-ocid="mentor.input"
          />
          {errors.time ? (
            <p
              className="text-sm text-destructive"
              data-ocid="mentor.error_state"
            >
              {errors.time}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="request-goals">Learning Goals</Label>
        <Textarea
          id="request-goals"
          value={goals}
          onChange={(event) => setGoals(event.target.value)}
          rows={4}
          placeholder="Describe what you want to learn, your current familiarity, and any specific questions..."
          aria-invalid={Boolean(errors.goals)}
          data-ocid="mentor.textarea"
        />
        {errors.goals ? (
          <p
            className="text-sm text-destructive"
            data-ocid="mentor.error_state"
          >
            {errors.goals}
          </p>
        ) : null}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            data-ocid="mentor.cancel_button"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" data-ocid="mentor.submit_button">
          <Send className="size-4" aria-hidden="true" />
          Send Request
        </Button>
      </DialogFooter>
    </form>
  );
}

function MentorNotFound() {
  return (
    <section
      className="container flex flex-col items-center py-24 text-center"
      data-ocid="mentor.error_state"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <GraduationCap className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
        Mentor Profile Not Found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This profile is unavailable or has been relocated. Explore our active
        student mentor directory.
      </p>
      <Button asChild className="mt-8" data-ocid="mentor.primary_button">
        <Link to="/explore">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to Explore
        </Link>
      </Button>
    </section>
  );
}

export function MentorProfilePage() {
  const { id } = useParams({ from: "/mentors/$id" });
  const { getMentor } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const mentor = getMentor(id);

  const averageRating = useMemo(() => {
    if (!mentor || mentor.reviews.length === 0) return mentor?.rating ?? 0;
    const total = mentor.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / mentor.reviews.length;
  }, [mentor]);

  if (!mentor) {
    return <MentorNotFound />;
  }

  return (
    <div data-ocid="mentor_profile.page">
      {/* Profile header */}
      <section className="border-b border-border bg-background">
        <div className="container py-10 md:py-14">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
            data-ocid="mentor.link"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Return to Explore
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-10">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
              <img
                src="/assets/generated/mentor-portrait.dim_800x1000.jpg"
                alt={`Portrait of ${mentor.name}, ${mentor.title.toLowerCase()}, in a university library.`}
                className="h-56 w-56 object-cover md:h-64 md:w-64"
                width={800}
                height={1000}
              />
            </div>

            <div className="min-w-0">
              <p className="label-eyebrow">Mentor Profile</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                {mentor.name}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-lg text-muted-foreground">
                <GraduationCap
                  className="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {mentor.title}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck
                    className="size-4 text-secondary"
                    aria-hidden="true"
                  />
                  {mentor.university}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  {mentor.city}
                </span>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="flex items-center gap-2">
                  <RatingStars rating={averageRating} />
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {Number(averageRating).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {mentor.reviewCount} reviews
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays
                    className="size-4 text-accent"
                    aria-hidden="true"
                  />
                  {mentor.sessionCount} sessions completed
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-56">
              <div className="rounded-xl border border-border bg-card p-5 shadow-subtle">
                <p className="font-mono text-2xl font-semibold text-primary">
                  {mentor.hourlyCredits} Credit
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  per hour (Equitable)
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" data-ocid="mentor.open_modal_button">
                    <Send className="size-4" aria-hidden="true" />
                    Request a Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      Request a Session
                    </DialogTitle>
                    <DialogDescription>
                      Propose a date and learning goal with {mentor.name}. Your
                      request will be delivered to their dashboard immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <RequestForm
                    mentor={mentor}
                    onSubmitted={() => setDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Skills taught */}
      <section
        className="border-b border-border bg-muted/40"
        data-ocid="mentor.section"
      >
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Expertise</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Skills Offered
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {mentor.teaches.map((skill) => (
              <article
                key={skill.id || skill.name}
                className="rounded-xl border border-border bg-card p-6 shadow-subtle"
                data-ocid="mentor.skill_card"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {skill.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${LEVEL_STYLES[skill.level] || "bg-primary/10 text-primary"}`}
                  >
                    {skill.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-accent">
                  {skill.category}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Languages className="size-4 text-primary" aria-hidden="true" />
              Spoken Languages
            </span>
            {mentor.languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground"
                data-ocid="mentor.badge"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bio and teaching approach */}
      <section
        className="border-b border-border bg-background"
        data-ocid="mentor.section"
      >
        <div className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label-eyebrow">Biography</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              About {mentor.name.split(" ")[0]}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {mentor.bio}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Every session starts with a review of your academic objectives,
              followed by an actionable progression plan. The focus is on
              hands-on practice, code walkthroughs, and exercises adapted to
              your pace.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-7 shadow-subtle">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Teaching Methodology
            </h3>
            <ul className="mt-5 space-y-4">
              {[
                "Diagnostic of your existing foundation during the first 10 minutes.",
                "Clear goals and practical, real-world mini-milestones.",
                "Reference materials, code snippets, and review exercises shared post-session.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <Clock className="size-4 text-accent" aria-hidden="true" />
              Availability: {mentor.availability}
            </p>
          </div>
        </div>
      </section>

      {/* Weekly availability */}
      <section
        className="border-b border-border bg-muted/40"
        data-ocid="mentor.section"
      >
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Schedule</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Weekly Availability Slots
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Typical time slots proposed by {mentor.name} across academic
              weeks.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AVAILABILITY_SLOTS.map((entry) => (
              <div
                key={entry.day}
                className="rounded-xl border border-border bg-card p-5 shadow-subtle"
                data-ocid="mentor.availability_card"
              >
                <p className="font-display text-base font-semibold text-foreground">
                  {entry.day}
                </p>
                {entry.slots.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {entry.slots.map((slot) => (
                      <li
                        key={slot}
                        className="rounded-md bg-primary/10 px-3 py-1.5 font-mono text-sm text-primary"
                      >
                        {slot}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No open slots
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-background" data-ocid="mentor.section">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="label-eyebrow">Reviews</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                What Students Say
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-subtle">
              <span className="font-mono text-3xl font-semibold text-primary">
                {Number(averageRating).toFixed(1)}
              </span>
              <div>
                <RatingStars rating={averageRating} />
                <p className="mt-1 text-xs text-muted-foreground">
                  {mentor.reviewCount} verified reviews
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mentor.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
