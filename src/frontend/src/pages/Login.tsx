import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { type FormEvent, useId, useState } from "react";

type AuthMode = "login" | "register";
type SubmitState = "idle" | "loading" | "success" | "error";

interface LoginErrors {
  email?: string;
  password?: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  university?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_ACCOUNT = {
  email: "camille.laurent@harvard.edu",
  password: "SkillSwap2026",
};

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(trimmed)) return "This email address is invalid.";
  return undefined;
}

function passwordStrength(password: string): {
  score: number;
  label: string;
  tone: string;
} {
  if (password.length === 0)
    return { score: 0, label: "No password", tone: "bg-border" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", tone: "bg-destructive" };
  if (score === 2) return { score: 2, label: "Medium", tone: "bg-warning" };
  if (score === 3) return { score: 3, label: "Strong", tone: "bg-accent" };
  return { score: 4, label: "Excellent", tone: "bg-success" };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-sm text-destructive"
    >
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loginValues, setLoginValues] = useState({
    email: DEMO_ACCOUNT.email,
    password: DEMO_ACCOUNT.password,
  });
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});

  const [registerValues, setRegisterValues] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const loginEmailId = useId();
  const loginPasswordId = useId();
  const registerNameId = useId();
  const registerEmailId = useId();
  const registerUniversityId = useId();
  const registerPasswordId = useId();
  const registerConfirmId = useId();
  const termsId = useId();

  const strength = passwordStrength(registerValues.password);

  function switchMode(next: AuthMode) {
    setMode(next);
    setSubmitState("idle");
    setErrorMessage("");
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: LoginErrors = {};
    const emailError = validateEmail(loginValues.email);
    if (emailError) errors.email = emailError;
    if (loginValues.password.trim().length === 0)
      errors.password = "Please enter your password.";
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitState("idle");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      await login(loginValues.email.trim(), loginValues.password);
      setSubmitState("success");
      setTimeout(() => {
        void navigate({ to: "/dashboard" });
      }, 600);
    } catch (err: unknown) {
      setSubmitState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please verify your email and password.",
      );
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: RegisterErrors = {};
    if (registerValues.name.trim().length < 2)
      errors.name = "Please enter your full name.";
    const emailError = validateEmail(registerValues.email);
    if (emailError) errors.email = emailError;
    if (registerValues.university.trim().length < 2)
      errors.university = "Please enter your university or college.";
    if (registerValues.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    else if (strength.score < 2)
      errors.password = "Please choose a stronger password.";
    if (registerValues.confirmPassword !== registerValues.password)
      errors.confirmPassword = "Passwords do not match.";
    if (!termsAccepted)
      errors.terms = "You must agree to the Terms of Service.";
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitState("idle");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      await api.register({
        name: registerValues.name.trim(),
        email: registerValues.email.trim(),
        password: registerValues.password,
        college: registerValues.university.trim(),
      });
      // Automatically log in after registration
      await login(registerValues.email.trim(), registerValues.password);
      setSubmitState("success");
      setTimeout(() => {
        void navigate({ to: "/dashboard" });
      }, 600);
    } catch (err: unknown) {
      setSubmitState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Registration failed. An account with this email may already exist.",
      );
    }
  }

  const isBusy = submitState === "loading" || submitState === "success";

  return (
    <section
      className="container py-12 md:py-20"
      data-ocid="login.page"
      aria-labelledby="login-heading"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <aside className="order-2 lg:order-1">
          <p className="label-eyebrow">SkillSwap Academic Community</p>
          <h1
            id="login-heading"
            className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            Exchange skills, shape your academic journey.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Connect with motivated university students to exchange peer
            knowledge. Teach what you master, learn what you are passionate
            about, and build real portfolio experience.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              {
                icon: GraduationCap,
                title: "Peer-to-Peer Mentorship",
                body: "One-on-one collaborative sessions with verified university peers.",
              },
              {
                icon: Sparkles,
                title: "Skill Exchange System",
                body: "Share your expertise, gain learning credits, and expand your horizons.",
              },
              {
                icon: ShieldCheck,
                title: "Academic Profiles",
                body: "Profiles tied to colleges, departments, and specific mastery areas.",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-subtle">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 text-accent" aria-hidden="true" />
              Pre-Seeded Demo Credentials
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You can log in directly with our default student account, or sign
              up with a new profile connected to the PostgreSQL backend:
            </p>
            <dl className="mt-3 grid gap-1.5 font-mono text-xs text-foreground">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Student Email:</dt>
                <dd className="font-semibold">{DEMO_ACCOUNT.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Password:</dt>
                <dd className="font-semibold">{DEMO_ACCOUNT.password}</dd>
              </div>
              <div className="flex gap-2 pt-1 border-t border-accent/20">
                <dt className="text-muted-foreground">Admin Email:</dt>
                <dd>admin@skillswap.edu (Admin@123)</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="order-1 lg:order-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated md:p-8">
            <div
              className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
              role="tablist"
              aria-label="Authentication Mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => switchMode("login")}
                data-ocid="login.tab"
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-smooth",
                  mode === "login"
                    ? "bg-card text-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                onClick={() => switchMode("register")}
                data-ocid="register.tab"
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-smooth",
                  mode === "register"
                    ? "bg-card text-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Register
              </button>
            </div>

            {submitState === "error" && (
              <div
                role="alert"
                data-ocid="login.error_state"
                className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4"
              >
                <AlertCircle
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                <div className="text-sm">
                  <p className="font-medium text-destructive">
                    Authentication Failed
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {errorMessage ||
                      "Invalid credentials. Please verify your email and password."}
                  </p>
                </div>
              </div>
            )}

            {submitState === "success" && (
              <output
                data-ocid="login.success_state"
                className="mt-6 flex items-center gap-3 rounded-lg border border-success/40 bg-success/5 p-4 text-sm text-success"
              >
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                Authentication successful. Redirecting to your dashboard…
              </output>
            )}

            {mode === "login" ? (
              <form
                onSubmit={handleLoginSubmit}
                noValidate
                className="mt-6 space-y-5"
                data-ocid="login.form"
              >
                <div className="space-y-2">
                  <Label htmlFor={loginEmailId}>Email Address</Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={loginEmailId}
                      type="email"
                      autoComplete="email"
                      placeholder="you@university.edu"
                      className="pl-9"
                      value={loginValues.email}
                      onChange={(event) =>
                        setLoginValues((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(loginErrors.email)}
                      aria-describedby={
                        loginErrors.email ? `${loginEmailId}-error` : undefined
                      }
                      data-ocid="login.input"
                    />
                  </div>
                  <FieldError
                    id={`${loginEmailId}-error`}
                    message={loginErrors.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={loginPasswordId}>Password</Label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={loginPasswordId}
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      value={loginValues.password}
                      onChange={(event) =>
                        setLoginValues((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(loginErrors.password)}
                      aria-describedby={
                        loginErrors.password
                          ? `${loginPasswordId}-error`
                          : undefined
                      }
                      data-ocid="login.password_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <FieldError
                    id={`${loginPasswordId}-error`}
                    message={loginErrors.password}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isBusy}
                  data-ocid="login.submit_button"
                >
                  {submitState === "loading" ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin mr-2"
                        aria-hidden="true"
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="size-4 ml-2" aria-hidden="true" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    data-ocid="login.register_link"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={handleRegisterSubmit}
                noValidate
                className="mt-6 space-y-5"
                data-ocid="register.form"
              >
                <div className="space-y-2">
                  <Label htmlFor={registerNameId}>Full Name</Label>
                  <div className="relative">
                    <UserRound
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={registerNameId}
                      type="text"
                      autoComplete="name"
                      placeholder="Alexandre Chen"
                      className="pl-9"
                      value={registerValues.name}
                      onChange={(event) =>
                        setRegisterValues((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(registerErrors.name)}
                      aria-describedby={
                        registerErrors.name
                          ? `${registerNameId}-error`
                          : undefined
                      }
                      data-ocid="register.input"
                    />
                  </div>
                  <FieldError
                    id={`${registerNameId}-error`}
                    message={registerErrors.name}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={registerEmailId}>
                    University Email Address
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={registerEmailId}
                      type="email"
                      autoComplete="email"
                      placeholder="you@university.edu"
                      className="pl-9"
                      value={registerValues.email}
                      onChange={(event) =>
                        setRegisterValues((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(registerErrors.email)}
                      aria-describedby={
                        registerErrors.email
                          ? `${registerEmailId}-error`
                          : undefined
                      }
                      data-ocid="register.email_input"
                    />
                  </div>
                  <FieldError
                    id={`${registerEmailId}-error`}
                    message={registerErrors.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={registerUniversityId}>
                    University / College
                  </Label>
                  <div className="relative">
                    <GraduationCap
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={registerUniversityId}
                      type="text"
                      autoComplete="organization"
                      placeholder="Harvard University"
                      className="pl-9"
                      value={registerValues.university}
                      onChange={(event) =>
                        setRegisterValues((current) => ({
                          ...current,
                          university: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(registerErrors.university)}
                      aria-describedby={
                        registerErrors.university
                          ? `${registerUniversityId}-error`
                          : undefined
                      }
                      data-ocid="register.university_input"
                    />
                  </div>
                  <FieldError
                    id={`${registerUniversityId}-error`}
                    message={registerErrors.university}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={registerPasswordId}>Password</Label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={registerPasswordId}
                      type={showRegisterPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="pl-9 pr-10"
                      value={registerValues.password}
                      onChange={(event) =>
                        setRegisterValues((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(registerErrors.password)}
                      aria-describedby={
                        registerErrors.password
                          ? `${registerPasswordId}-error`
                          : undefined
                      }
                      data-ocid="register.password_input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((v) => !v)}
                      aria-label={
                        showRegisterPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5" data-ocid="register.strength">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-smooth",
                            step <= strength.score
                              ? strength.tone
                              : "bg-border",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Strength:{" "}
                      <span className="font-medium text-foreground">
                        {strength.label}
                      </span>
                    </p>
                  </div>

                  <FieldError
                    id={`${registerPasswordId}-error`}
                    message={registerErrors.password}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={registerConfirmId}>Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={registerConfirmId}
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={registerValues.confirmPassword}
                      onChange={(event) =>
                        setRegisterValues((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }))
                      }
                      aria-invalid={Boolean(registerErrors.confirmPassword)}
                      aria-describedby={
                        registerErrors.confirmPassword
                          ? `${registerConfirmId}-error`
                          : undefined
                      }
                      data-ocid="register.confirm_input"
                    />
                  </div>
                  <FieldError
                    id={`${registerConfirmId}-error`}
                    message={registerErrors.confirmPassword}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={termsId}
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setTermsAccepted(checked === true)
                      }
                      aria-invalid={Boolean(registerErrors.terms)}
                      data-ocid="register.checkbox"
                    />
                    <Label
                      htmlFor={termsId}
                      className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
                    >
                      I agree to the SkillSwap Terms of Service, Honor Code, and
                      Privacy Policy.
                    </Label>
                  </div>
                  <FieldError
                    id={`${termsId}-error`}
                    message={registerErrors.terms}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isBusy}
                  data-ocid="register.submit_button"
                >
                  {submitState === "loading" ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin mr-2"
                        aria-hidden="true"
                      />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="size-4 ml-2" aria-hidden="true" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    data-ocid="register.login_link"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
