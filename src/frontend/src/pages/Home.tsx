import { Button } from "@/components/ui/button";
import { CATEGORY_DESCRIPTIONS, TESTIMONIALS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { Mentor, SkillCategory } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Hammer,
  Languages,
  Music,
  Palette,
  Quote,
  Repeat2,
  Search,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Programming: Code2,
  Design: Palette,
  Languages: Languages,
  Music: Music,
  Academics: BookOpen,
  Crafts: Hammer,
  Programmation: Code2,
  Langues: Languages,
  Musique: Music,
  Académique: BookOpen,
  Artisanat: Hammer,
};

const CATEGORY_ORDER: SkillCategory[] = [
  "Programming",
  "Design",
  "Languages",
  "Music",
  "Academics",
  "Crafts",
];

const STATS = [
  { value: "2,400+", label: "Active Mentors", icon: Users },
  { value: "180+", label: "Academic Skills", icon: GraduationCap },
  { value: "12,000+", label: "Sessions Exchanged", icon: Repeat2 },
];

const STEPS = [
  {
    title: "Create Your Profile",
    description:
      "Showcase skills you have mastered and subjects you are excited to explore. Your college journey is your greatest asset.",
  },
  {
    title: "Find Your Mentor",
    description:
      "Browse fellow students by discipline, inspect verified reviews, and pick a peer whose expertise aligns with your academic goals.",
  },
  {
    title: "Exchange Knowledge",
    description:
      "Schedule a session and teach in turn. Every hour you share earns you an hour of mentoring: equitable and free.",
  },
];

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <Link
      to="/mentors/$id"
      params={{ id: String(mentor.id) }}
      data-ocid="home.mentor_card"
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-semibold text-secondary-foreground">
          {mentor.avatarInitials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
            {mentor.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {mentor.university}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Star
              className="size-4 fill-accent text-accent"
              aria-hidden="true"
            />
            {Number(mentor.rating).toFixed(1)}
            <span className="font-normal text-muted-foreground">
              · {mentor.reviewCount} reviews
            </span>
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {mentor.teaches.slice(0, 3).map((skill) => (
          <li
            key={skill.id || skill.name}
            className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground"
          >
            {skill.name}
          </li>
        ))}
      </ul>

      <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {mentor.bio}
      </p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth group-hover:gap-2.5">
        View Profile
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function HomePage() {
  const { mentors } = useStore();
  const featuredMentors = mentors
    .filter((mentor) => mentor.featured)
    .slice(0, 6);

  return (
    <div data-ocid="home.page">
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Student Skill Exchange Platform</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Share what you know. Learn what you love.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SkillSwap connects college students across campus networks to
              exchange skills freely — without fees or middlemen. Teach an hour,
              learn an hour.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" data-ocid="home.primary_button">
                <Link to="/explore">
                  Explore Skills
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="home.secondary_button"
              >
                <Link to="/login">Become a Mentor</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Over 2,400 active students exchanging knowledge across university
              campuses.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
              <img
                src="/assets/generated/hero-student.dim_1024x1280.jpg"
                alt="Smiling university student studying in a modern academic library."
                className="h-full w-full object-cover"
                width={1024}
                height={1280}
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-card px-5 py-4 shadow-lifted sm:block">
              <p className="font-mono text-2xl font-semibold text-primary">
                1 Hr = 1 Hr
              </p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Equitable Exchange
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics band */}
      <section
        className="border-b border-border bg-secondary text-secondary-foreground"
        data-ocid="home.section"
      >
        <div className="container grid gap-8 py-12 sm:grid-cols-3 md:py-14">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4"
              data-ocid="home.stat"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                <stat.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-2xl font-semibold md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-secondary-foreground/70">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill categories */}
      <section className="bg-background" data-ocid="home.section">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Disciplines</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Explore by Skill Category
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Six core academic disciplines, hundreds of skills shared by
              passionate students.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_ORDER.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Code2;
              return (
                <Link
                  key={category}
                  to="/explore"
                  search={{ category }}
                  data-ocid="home.category_card"
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                    {category}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth group-hover:gap-2.5">
                    Explore
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured mentors */}
      <section
        className="border-y border-border bg-muted/40"
        data-ocid="home.section"
      >
        <div className="container py-16 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="label-eyebrow">Excellence</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Featured Student Mentors
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Top-rated peer mentors ready to share practical project insights
                and academic mastery.
              </p>
            </div>
            <Button asChild variant="outline" data-ocid="home.secondary_button">
              <Link to="/explore">
                <Search className="size-4" aria-hidden="true" />
                View All Mentors
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-background" data-ocid="home.section">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Methodology</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              How SkillSwap Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to transform your knowledge into new
              capabilities.
            </p>
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-xl border border-border bg-card p-7 shadow-subtle"
                data-ocid="home.step"
              >
                <span className="font-mono text-sm font-semibold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="border-t border-border bg-muted/40"
        data-ocid="home.section"
      >
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label-eyebrow">Student Stories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Empowering Peer Learning
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.id}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-subtle"
                data-ocid="home.testimonial"
              >
                <Quote className="size-7 text-accent" aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="font-display text-base font-semibold text-foreground">
                    {testimonial.authorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.authorRole} · {testimonial.authorUniversity}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-background" data-ocid="home.section">
        <div className="container py-16 md:py-24">
          <div className="rounded-xl border border-border bg-secondary px-8 py-14 text-center text-secondary-foreground shadow-elevated md:px-16">
            <p className="label-eyebrow">Join the Community</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Your Knowledge is Worth a New Skill
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/75">
              Create your profile in minutes and match with your first
              skill-exchange peer today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                data-ocid="home.primary_button"
              >
                <Link to="/login">
                  Create My Profile
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
                data-ocid="home.secondary_button"
              >
                <Link to="/explore">Browse All Mentors</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
