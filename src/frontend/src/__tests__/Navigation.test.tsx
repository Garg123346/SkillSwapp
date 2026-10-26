import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/lib/store";
import { CommunityPage } from "@/pages/Community";
import { DashboardPage } from "@/pages/Dashboard";
import { ExplorePage, validateExploreSearch } from "@/pages/Explore";
import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/Login";
import { MentorProfilePage } from "@/pages/MentorProfile";
import { MessagesPage } from "@/pages/Messages";
import { MySkillsPage } from "@/pages/MySkills";
import { RequestsPage } from "@/pages/Requests";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

function renderApp(path = "/") {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ),
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
  });
  const exploreRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/explore",
    component: ExplorePage,
    validateSearch: validateExploreSearch,
  });
  const mentorRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/mentors/$id",
    component: MentorProfilePage,
  });
  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: DashboardPage,
  });
  const mySkillsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/my-skills",
    component: MySkillsPage,
  });
  const requestsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/requests",
    component: RequestsPage,
  });
  const messagesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/messages",
    component: MessagesPage,
  });
  const communityRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/community",
    component: CommunityPage,
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
  });

  const routeTree = rootRoute.addChildren([
    homeRoute,
    exploreRoute,
    mentorRoute,
    dashboardRoute,
    mySkillsRoute,
    requestsRoute,
    messagesRoute,
    communityRoute,
    loginRoute,
  ]);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  render(
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>,
  );

  return router;
}

describe("App navigation", () => {
  it("renders the home page without a blank screen", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", {
        name: "Partagez ce que vous savez. Apprenez ce que vous aimez.",
      }),
    ).toBeInTheDocument();
  });

  it("reaches Explore, Community, Dashboard and Messages from the header", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await screen.findByRole("heading", {
      name: "Partagez ce que vous savez. Apprenez ce que vous aimez.",
    });

    const headerNav = screen.getByRole("navigation", {
      name: "Navigation principale",
    });

    await user.click(within(headerNav).getByRole("link", { name: "Explorer" }));
    expect(
      await screen.findByRole("heading", {
        name: "Explorer les compétences",
      }),
    ).toBeInTheDocument();

    await user.click(
      within(headerNav).getByRole("link", { name: "Communauté" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Le fil des étudiants" }),
    ).toBeInTheDocument();

    await user.click(
      within(headerNav).getByRole("link", { name: "Tableau de bord" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Bonjour, Alexandre" }),
    ).toBeInTheDocument();

    await user.click(within(headerNav).getByRole("link", { name: "Messages" }));
    expect(
      await screen.findByRole("heading", { name: "Messages" }),
    ).toBeInTheDocument();
  });

  it("reaches My Skills, Requests and Login from the footer", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await screen.findByRole("heading", {
      name: "Partagez ce que vous savez. Apprenez ce que vous aimez.",
    });

    const footer = screen.getByRole("contentinfo");

    await user.click(
      within(footer).getByRole("link", { name: "Mes compétences" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Ce que j'enseigne, ce que j'apprends",
      }),
    ).toBeInTheDocument();

    await user.click(
      within(footer).getByRole("link", { name: "Demandes d'apprentissage" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Demandes d'apprentissage",
      }),
    ).toBeInTheDocument();

    await user.click(
      within(footer).getByRole("link", { name: "Se connecter" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Échangez vos compétences, façonnez votre parcours.",
      }),
    ).toBeInTheDocument();
  });
});
