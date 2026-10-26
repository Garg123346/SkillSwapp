import { DashboardPage } from "@/pages/Dashboard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("DashboardPage", () => {
  it("welcomes the student and renders the statistics", async () => {
    render(renderWithRouter(<DashboardPage />, { path: "/dashboard" }));

    expect(
      await screen.findByRole("heading", { name: "Bonjour, Alexandre" }),
    ).toBeInTheDocument();

    // "Sessions à venir" appears as both a stat label and a card title.
    expect(screen.getAllByText("Sessions à venir").length).toBeGreaterThan(0);
    expect(screen.getByText("Heures d'apprentissage")).toBeInTheDocument();
    expect(screen.getByText("Compétences enseignées")).toBeInTheDocument();
    expect(screen.getByText("Sessions terminées")).toBeInTheDocument();
  });

  it("renders upcoming sessions, pending requests, recommended mentors and activity", async () => {
    render(renderWithRouter(<DashboardPage />, { path: "/dashboard" }));

    expect(await screen.findByText("Demandes en attente")).toBeInTheDocument();
    expect(screen.getByText("Mentors recommandés")).toBeInTheDocument();
    expect(screen.getByText("Activité récente")).toBeInTheDocument();

    // A pending request and a recommended mentor are visible.
    expect(screen.getByText("Rédaction de thèse")).toBeInTheDocument();
    // "Sofia Rossi" can appear in both the recommended mentors and the
    // pending requests lists, so assert at least one occurrence.
    expect(screen.getAllByText("Sofia Rossi").length).toBeGreaterThan(0);
  });
});
