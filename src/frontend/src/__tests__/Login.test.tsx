import { LoginPage } from "@/pages/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("LoginPage", () => {
  it("shows inline validation errors for an invalid login", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<LoginPage />, { path: "/login" }));

    await user.click(
      await screen.findByRole("button", { name: "Se connecter" }),
    );

    expect(
      await screen.findByText("Veuillez saisir votre adresse e-mail."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Veuillez saisir votre mot de passe."),
    ).toBeInTheDocument();
  });

  it("rejects a malformed e-mail and a wrong demo password", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<LoginPage />, { path: "/login" }));

    await user.type(
      await screen.findByLabelText("Adresse e-mail"),
      "not-an-email",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "wrong");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Cette adresse e-mail n'est pas valide."),
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Adresse e-mail"));
    await user.type(
      screen.getByLabelText("Adresse e-mail"),
      "camille.laurent@harvard.edu",
    );
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Connexion impossible", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("validates the registration form inline", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<LoginPage />, { path: "/login" }));

    await user.click(await screen.findByRole("tab", { name: "Inscription" }));

    await user.click(
      await screen.findByRole("button", { name: "Créer mon compte" }),
    );

    expect(
      await screen.findByText("Veuillez indiquer votre nom complet."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Veuillez indiquer votre université."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Le mot de passe doit contenir au moins 8 caractères."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Vous devez accepter les conditions d'utilisation."),
    ).toBeInTheDocument();
  });

  it("authenticates with the demo account and reports success", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<LoginPage />, { path: "/login" }));

    await user.type(
      await screen.findByLabelText("Adresse e-mail"),
      "camille.laurent@harvard.edu",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "SkillSwap2026");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText(
        /Authentification réussie/,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
