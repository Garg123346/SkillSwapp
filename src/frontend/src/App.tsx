import { Layout } from "@/components/Layout";
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
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </StoreProvider>
  );
}
