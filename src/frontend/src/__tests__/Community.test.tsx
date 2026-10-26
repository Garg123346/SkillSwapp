import { CommunityPage } from "@/pages/Community";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("CommunityPage", () => {
  it("renders the feed with posts and a publication count", async () => {
    render(renderWithRouter(<CommunityPage />, { path: "/community" }));

    expect(
      await screen.findByRole("heading", { name: "Le fil des étudiants" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Comment structurer un projet React qui grandit sainement",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("likes a post and increments its like count", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<CommunityPage />, { path: "/community" }));

    const likeButton = await screen.findByRole("button", {
      name: "Aimer Comment structurer un projet React qui grandit sainement",
    });
    expect(likeButton).toHaveTextContent("84");

    await user.click(likeButton);

    expect(
      await screen.findByRole("button", {
        name: "Retirer le j'aime de Comment structurer un projet React qui grandit sainement",
      }),
    ).toHaveTextContent("85");
  });

  it("bookmarks a post and lists it under the saved tab", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<CommunityPage />, { path: "/community" }));

    await user.click(
      await screen.findByRole("button", {
        name: "Enregistrer Trois paires typographiques qui fonctionnent toujours",
      }),
    );

    await user.click(screen.getByRole("tab", { name: /Enregistrés/ }));

    expect(
      await screen.findByText(
        "Trois paires typographiques qui fonctionnent toujours",
      ),
    ).toBeInTheDocument();
    // The other posts are not saved.
    expect(
      screen.queryByText(
        "Comment structurer un projet React qui grandit sainement",
      ),
    ).not.toBeInTheDocument();
  });

  it("validates the create post modal and publishes a new post", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<CommunityPage />, { path: "/community" }));

    await user.click(
      await screen.findByRole("button", { name: "Créer une publication" }),
    );

    // Submitting empty shows the inline error.
    await user.click(screen.getByRole("button", { name: "Publier" }));
    expect(
      await screen.findByText("Un titre et un contenu sont nécessaires."),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Titre"),
      "Mon premier projet de recherche",
    );
    await user.type(
      screen.getByLabelText("Contenu"),
      "Je partage ma méthode de travail en archives.",
    );
    await user.click(screen.getByRole("button", { name: "Publier" }));

    expect(
      await screen.findByText("Mon premier projet de recherche"),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("7")).toBeInTheDocument());
  });
});
