import { MessagesPage } from "@/pages/Messages";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("MessagesPage", () => {
  it("lists conversations and opens the first one by default", async () => {
    render(renderWithRouter(<MessagesPage />, { path: "/messages" }));

    expect(
      await screen.findByRole("heading", { name: "Messages" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sofia Rossi")).toBeInTheDocument();
    expect(screen.getByText("Antoine Mercier")).toBeInTheDocument();

    // First conversation is selected and its thread is shown.
    expect(
      screen.getByText(
        "Bonjour Camille ! Je construis un portfolio et je bloque sur la gestion d'état.",
      ),
    ).toBeInTheDocument();
  });

  it("sends a demo message that appears in the conversation", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MessagesPage />, { path: "/messages" }));

    const input = await screen.findByRole("textbox", {
      name: "Votre message",
    });
    await user.type(input, "Merci, je prépare mon dépôt Git.");

    await user.click(
      screen.getByRole("button", { name: "Envoyer le message" }),
    );

    expect(
      await screen.findByText("Merci, je prépare mon dépôt Git."),
    ).toBeInTheDocument();
  });

  it("filters the conversation list by search", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<MessagesPage />, { path: "/messages" }));

    const search = await screen.findByRole("textbox", {
      name: "Rechercher une conversation",
    });
    await user.type(search, "Sofia");

    expect(screen.getByText("Sofia Rossi")).toBeInTheDocument();
    expect(screen.queryByText("Antoine Mercier")).not.toBeInTheDocument();
  });
});
