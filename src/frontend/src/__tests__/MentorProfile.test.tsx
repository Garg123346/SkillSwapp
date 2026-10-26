import { MentorProfilePage } from "@/pages/MentorProfile";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("MentorProfilePage", () => {
  it("renders the mentor bio, skills, reviews and availability", async () => {
    render(renderWithRouter(<MentorProfilePage />, { path: "/mentors/m-1" }));

    expect(
      await screen.findByRole("heading", { name: "Camille Lefèvre" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Compétences enseignées" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ce que disent les étudiants" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Créneaux de la semaine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Théo Marchand")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown mentor", async () => {
    render(renderWithRouter(<MentorProfilePage />, { path: "/mentors/m-999" }));

    expect(
      await screen.findByRole("heading", { name: "Mentor introuvable" }),
    ).toBeInTheDocument();
  });

  it("opens the request modal and validates required fields", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MentorProfilePage />, { path: "/mentors/m-1" }));

    const openButton = await screen.findByRole("button", {
      name: "Demander une session",
    });
    await user.click(openButton);

    expect(
      await screen.findByRole("heading", { name: "Demander une session" }),
    ).toBeInTheDocument();

    // Submit empty: date, time and goals are required.
    await user.click(
      screen.getByRole("button", { name: "Envoyer la demande" }),
    );

    expect(
      await screen.findByText("Indiquez une date souhaitée."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Indiquez un créneau horaire."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Décrivez vos objectifs en quelques mots (10 caractères min.).",
      ),
    ).toBeInTheDocument();
  });

  it("captures date, time and goals and confirms submission", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MentorProfilePage />, { path: "/mentors/m-1" }));

    await user.click(
      await screen.findByRole("button", { name: "Demander une session" }),
    );

    const dateInput = await screen.findByLabelText("Date souhaitée");
    const timeInput = screen.getByLabelText("Créneau horaire");
    const goalsInput = screen.getByLabelText("Objectifs d'apprentissage");

    await user.type(dateInput, "2026-09-18");
    await user.type(timeInput, "18:00");
    await user.type(goalsInput, "Je veux structurer mon portfolio React.");

    await user.click(
      screen.getByRole("button", { name: "Envoyer la demande" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Demande envoyée" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Voir mes demandes" }),
      ).toBeInTheDocument(),
    );
  });
});
