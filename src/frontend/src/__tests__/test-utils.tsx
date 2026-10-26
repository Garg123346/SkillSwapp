import { StoreProvider } from "@/lib/store";
import { validateExploreSearch } from "@/pages/Explore";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Renders a page inside the app's StoreProvider and a minimal in-memory router
 * so router hooks (useNavigate, useSearch, useParams, Link) resolve.
 */
export function renderWithRouter(
  ui: ReactNode,
  options: { path?: string } = {},
): ReactNode {
  const path = options.path ?? "/";
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <>{ui}</>,
  });
  const exploreRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/explore",
    component: () => <>{ui}</>,
    validateSearch: validateExploreSearch,
  });
  const mentorRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/mentors/$id",
    component: () => <>{ui}</>,
  });
  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: () => <>{ui}</>,
  });
  const mySkillsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/my-skills",
    component: () => <>{ui}</>,
  });
  const requestsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/requests",
    component: () => <>{ui}</>,
  });
  const messagesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/messages",
    component: () => <>{ui}</>,
  });
  const communityRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/community",
    component: () => <>{ui}</>,
  });
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: () => <>{ui}</>,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
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

  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}
