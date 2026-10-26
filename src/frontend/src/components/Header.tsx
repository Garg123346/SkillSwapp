import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { GraduationCap, LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/community", label: "Community" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/messages", label: "Messages" },
] as const;

export function Header() {
  const { isAuthenticated, currentUserName, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          data-ocid="header.link"
          className="flex items-center gap-2.5 rounded-md transition-smooth hover:opacity-80"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            SkillSwap
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`header.link.${link.to.replace("/", "")}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground",
                location.pathname === link.to && "bg-muted text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                data-ocid="header.dashboard_button"
              >
                <Link to="/dashboard">
                  <UserRound className="size-4" aria-hidden="true" />
                  {currentUserName ? currentUserName.split(" ")[0] : "Profile"}
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={logout}
                data-ocid="header.logout_button"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                data-ocid="header.login_button"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" data-ocid="header.join_button">
                <Link to="/login">Join SkillSwap</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              data-ocid="header.open_modal_button"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-display text-xl">
                SkillSwap
              </SheetTitle>
              <SheetDescription>
                Exchange skills with fellow college students.
              </SheetDescription>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4"
              aria-label="Mobile Navigation"
            >
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    data-ocid={`header.mobile_link.${link.to.replace("/", "")}`}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              {isAuthenticated ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  data-ocid="header.mobile_logout_button"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign Out
                </Button>
              ) : (
                <SheetClose asChild>
                  <Button asChild data-ocid="header.mobile_login_button">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
