import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SKILL_CATEGORIES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { Mentor, SkillCategory } from "@/lib/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Hammer,
  Languages,
  Music,
  Palette,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";

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

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
type Level = (typeof LEVELS)[number];

const SORTS = [
  { value: "rating", label: "Top Rated" },
  { value: "availability", label: "Availability" },
  { value: "name", label: "Name (A-Z)" },
] as const;
type SortValue = (typeof SORTS)[number]["value"];

export interface ExploreSearch {
  category?: SkillCategory;
  level?: Level;
  sort?: SortValue;
  q?: string;
}

function isCategory(value: unknown): value is SkillCategory {
  return SKILL_CATEGORIES.includes(value as SkillCategory);
}

function isLevel(value: unknown): value is Level {
  return LEVELS.includes(value as Level);
}

function isSort(value: unknown): value is SortValue {
  return SORTS.some((sort) => sort.value === value);
}

export function validateExploreSearch(
  search: Record<string, unknown>,
): ExploreSearch {
  const result: ExploreSearch = {};
  if (isCategory(search.category)) result.category = search.category;
  if (isLevel(search.level)) result.level = search.level;
  if (search.sort === "note") result.sort = "rating";
  else if (search.sort === "nom") result.sort = "name";
  else if (isSort(search.sort)) result.sort = search.sort;
  if (typeof search.q === "string" && search.q.length > 0) result.q = search.q;
  return result;
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <article
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-elevated"
      data-ocid="explore.mentor_card"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-semibold text-secondary-foreground">
          {mentor.avatarInitials}
        </span>
        <div className="min-w-0 flex-1">
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

      <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <GraduationCap
          className="size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span className="truncate">{mentor.availability}</span>
      </p>

      <div className="mt-6 flex-1" />

      <Button
        asChild
        variant="outline"
        className="w-full"
        data-ocid="explore.link"
      >
        <Link to="/mentors/$id" params={{ id: String(mentor.id) }}>
          View Profile
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

export function ExplorePage() {
  const search = useSearch({ from: "/explore" });
  const navigate = useNavigate();
  const { mentors } = useStore();

  const category = search.category;
  const level = search.level;
  const sort = search.sort ?? "rating";
  const query = search.q ?? "";

  const updateSearch = (patch: Partial<ExploreSearch>) => {
    void navigate({
      to: "/explore",
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });
  };

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = mentors.filter((mentor) => {
      if (
        category &&
        !mentor.teaches.some(
          (s) => s.category.toLowerCase() === category.toLowerCase(),
        )
      ) {
        return false;
      }
      if (
        level &&
        !mentor.teaches.some(
          (s) => s.level.toLowerCase() === level.toLowerCase(),
        )
      ) {
        return false;
      }
      if (normalized.length > 0) {
        const matchesName = mentor.name.toLowerCase().includes(normalized);
        const matchesSkill = mentor.teaches.some((s) =>
          s.name.toLowerCase().includes(normalized),
        );
        const matchesUni = mentor.university.toLowerCase().includes(normalized);
        if (!matchesName && !matchesSkill && !matchesUni) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "availability") {
        return a.availability.localeCompare(b.availability);
      }
      return b.rating - a.rating;
    });
  }, [mentors, category, level, sort, query]);

  const hasFilters =
    category !== undefined ||
    level !== undefined ||
    query.length > 0 ||
    sort !== "rating";

  return (
    <div data-ocid="explore.page">
      {/* Page header */}
      <section className="border-b border-border bg-background">
        <div className="container py-12 md:py-16">
          <p className="label-eyebrow">Discover</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Explore Skills & Mentors
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Browse peer mentors, filter by academic discipline, and find
            students ready to exchange expertise.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section
        className="border-b border-border bg-muted/40"
        data-ocid="explore.section"
      >
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) =>
                    updateSearch({ q: event.target.value || undefined })
                  }
                  placeholder="Search by mentor name, skill, or university..."
                  aria-label="Search mentors or skills"
                  className="h-11 bg-card pl-10"
                  data-ocid="explore.search_input"
                />
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="explore-sort"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  Sort by
                </label>
                <select
                  id="explore-sort"
                  value={sort}
                  onChange={(event) =>
                    updateSearch({ sort: event.target.value as SortValue })
                  }
                  className="h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-smooth focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  data-ocid="explore.select"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateSearch({ category: undefined })}
                aria-pressed={category === undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  category === undefined
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/10"
                }`}
                data-ocid="explore.filter.tab"
              >
                All Disciplines
              </button>
              {SKILL_CATEGORIES.map((item) => {
                const Icon = CATEGORY_ICONS[item] || Code2;
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      updateSearch({ category: active ? undefined : item })
                    }
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/10"
                    }`}
                    data-ocid="explore.filter.tab"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Proficiency Level
              </span>
              {LEVELS.map((item) => {
                const active = level === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      updateSearch({ level: active ? undefined : item })
                    }
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      active
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : "border-border bg-card text-foreground hover:border-accent/60 hover:bg-accent/10"
                    }`}
                    data-ocid="explore.filter.tab"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-background" data-ocid="explore.section">
        <div className="container py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className="text-sm text-muted-foreground"
              data-ocid="explore.list"
            >
              <span className="font-mono font-semibold text-foreground">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "mentor found" : "mentors found"}
            </p>
            {hasFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  updateSearch({
                    category: undefined,
                    level: undefined,
                    sort: undefined,
                    q: undefined,
                  })
                }
                data-ocid="explore.secondary_button"
              >
                <X className="size-4" aria-hidden="true" />
                Reset Filters
              </Button>
            ) : null}
          </div>

          {results.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div
              className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
              data-ocid="explore.empty_state"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Search className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
                No Mentors Found
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Try widening your search terms or clearing some filters to
                explore more student profiles.
              </p>
              <Button
                type="button"
                className="mt-8"
                onClick={() =>
                  updateSearch({
                    category: undefined,
                    level: undefined,
                    sort: undefined,
                    q: undefined,
                  })
                }
                data-ocid="explore.primary_button"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
