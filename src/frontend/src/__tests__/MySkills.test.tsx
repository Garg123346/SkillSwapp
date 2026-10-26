import { MySkillsPage } from "@/pages/MySkills";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("MySkillsPage", () => {
  it("lists the skills the student teaches", async () => {
    render(renderWithRouter(<MySkillsPage />, { path: "/my-skills" }));

    expect(
      await screen.findByRole("heading", {
        name: "Ce que j'enseigne, ce que j'apprends",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Français littéraire")).toBeInTheDocument();
    expect(screen.getByText("Méthodologie de recherche")).toBeInTheDocument();
  });

  it("adds a new teaching skill", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MySkillsPage />, { path: "/my-skills" }));

    await user.click(
      await screen.findByRole("button", { name: "Ajouter une compétence" }),
    );

    const nameInput = await screen.findByLabelText("Nom de la compétence");
    await user.type(nameInput, "Photographie argentique");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(
      await screen.findByText("Photographie argentique"),
    ).toBeInTheDocument();
  });

  it("edits an existing skill", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MySkillsPage />, { path: "/my-skills" }));

    await user.click(
      await screen.findByRole("button", {
        name: "Modifier Français littéraire",
      }),
    );

    const nameInput = await screen.findByLabelText("Nom de la compétence");
    await user.clear(nameInput);
    await user.type(nameInput, "Littérature comparée");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByText("Littérature comparée")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Français littéraire")).not.toBeInTheDocument(),
    );
  });

  it("removes a skill after confirmation", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MySkillsPage />, { path: "/my-skills" }));

    await user.click(
      await screen.findByRole("button", {
        name: "Supprimer Français littéraire",
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Supprimer cette compétence ?",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() =>
      expect(screen.queryByText("Français littéraire")).not.toBeInTheDocument(),
    );
  });
});
