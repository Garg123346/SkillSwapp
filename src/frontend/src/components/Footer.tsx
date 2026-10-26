import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { to: "/explore", label: "Explore Skills" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/my-skills", label: "My Skills" },
      { to: "/requests", label: "Learning Requests" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/community", label: "Campus Discussions" },
      { to: "/messages", label: "Messages" },
      { to: "/login", label: "Join SkillSwap" },
      { to: "/login", label: "Sign In" },
    ],
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-accent/40 bg-secondary text-secondary-foreground">
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                SkillSwap
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-secondary-foreground/75">
              The premier student-to-student skill exchange platform. Teach what
              you have mastered, learn what you love — 1 hour taught equals 1
              hour learned.
            </p>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/70">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                Global Academic & College Campus Network
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-accent" aria-hidden="true" />
                contact@skillswap.edu
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="font-display text-base font-semibold text-secondary-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-secondary-foreground/70 transition-smooth hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-secondary-foreground/15 pt-6 text-sm text-secondary-foreground/60 md:flex-row md:items-center">
          <p>
            © {currentYear} SkillSwap. All rights reserved. BTech Java
            Full-Stack Project.
          </p>
          <span className="transition-smooth hover:text-accent">
            Academic Elegance & Innovative Spirit
          </span>
        </div>
      </div>
    </footer>
  );
}
