import { HomePage } from "@/pages/Home";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("HomePage", () => {
  it("renders the hero tagline and at least one relevant image", async () => {
    render(renderWithRouter(<HomePage />));

    expect(
      await screen.findByRole("heading", {
        name: "Partagez ce que vous savez. Apprenez ce que vous aimez.",
      }),
    ).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute("src");
  });

  it("renders statistics, skill categories, featured mentors, how-it-works and testimonials", async () => {
    render(renderWithRouter(<HomePage />));

    // Statistics band
    expect(await screen.findByText("2 400+")).toBeInTheDocument();
    expect(screen.getByText("Mentors actifs")).toBeInTheDocument();

    // Skill categories
    expect(
      screen.getByRole("heading", { name: "Explorez par compétence" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Programmation")).toBeInTheDocument();

    // Featured mentors
    expect(
      screen.getByRole("heading", { name: "Mentors en vedette" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Camille Lefèvre")).toBeInTheDocument();

    // How it works
    expect(
      screen.getByRole("heading", { name: "Comment cela fonctionne" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Créez votre profil")).toBeInTheDocument();

    // Testimonials
    expect(
      screen.getByRole("heading", { name: "Ils échangent déjà" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jade Fontaine")).toBeInTheDocument();
  });
});
