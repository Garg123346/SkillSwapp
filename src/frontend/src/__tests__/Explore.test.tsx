import { ExplorePage, validateExploreSearch } from "@/pages/Explore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("validateExploreSearch", () => {
  it("keeps valid filters and drops unknown values", () => {
    expect(
      validateExploreSearch({
        category: "Design",
        level: "Avancé",
        sort: "nom",
        q: "React",
      }),
    ).toEqual({
      category: "Design",
      level: "Avancé",
      sort: "nom",
      q: "React",
    });

    expect(
      validateExploreSearch({
        category: "Inconnue",
        level: "Expert",
        sort: "invalide",
        q: "",
      }),
    ).toEqual({});
  });
});

describe("ExplorePage", () => {
  it("renders all mentors by default", async () => {
    render(renderWithRouter(<ExplorePage />, { path: "/explore" }));

    expect(
      await screen.findByRole("heading", {
        name: "Explorer les compétences",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("mentors trouvés")).toBeInTheDocument();
    expect(screen.getByText("Camille Lefèvre")).toBeInTheDocument();
    expect(screen.getByText("Mathieu Perrin")).toBeInTheDocument();
  });

  it("filters results by category from the URL", async () => {
    render(
      renderWithRouter(<ExplorePage />, { path: "/explore?category=Design" }),
    );

    // Design mentors: Camille Lefèvre, Sofia Rossi, Clara Nguyen, Hugo Blanc
    expect(await screen.findByText("Sofia Rossi")).toBeInTheDocument();
    expect(screen.getByText("Clara Nguyen")).toBeInTheDocument();
    expect(screen.getByText("Hugo Blanc")).toBeInTheDocument();
    // Antoine Mercier teaches only Programmation/Académique skills.
    expect(screen.queryByText("Antoine Mercier")).not.toBeInTheDocument();
  });

  it("filters results by search query", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<ExplorePage />, { path: "/explore" }));

    const input = await screen.findByRole("searchbox", {
      name: "Rechercher un mentor ou une compétence",
    });
    await user.type(input, "Sofia");

    expect(await screen.findByText("Sofia Rossi")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("mentor trouvé")).toBeInTheDocument();
  });

  it("shows an empty state when no mentor matches", async () => {
    render(renderWithRouter(<ExplorePage />, { path: "/explore?q=zzzzz" }));

    expect(
      await screen.findByRole("heading", {
        name: "Aucun mentor ne correspond",
      }),
    ).toBeInTheDocument();
  });
});
