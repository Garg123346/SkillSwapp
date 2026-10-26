import { RequestsPage } from "@/pages/Requests";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "./test-utils";

describe("RequestsPage", () => {
  it("shows sent requests by default and received requests on the other tab", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<RequestsPage />, { path: "/requests" }));

    expect(
      await screen.findByRole("heading", {
        name: "Demandes d'apprentissage",
      }),
    ).toBeInTheDocument();

    // Sent tab is the default.
    expect(screen.getByText("React & TypeScript")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Reçues/ }));

    expect(await screen.findByText("Rédaction de thèse")).toBeInTheDocument();
  });

  it("accepts a received pending request", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<RequestsPage />, { path: "/requests" }));

    await user.click(await screen.findByRole("tab", { name: /Reçues/ }));

    const acceptButton = await screen.findByRole("button", {
      name: "Accepter",
    });
    await user.click(acceptButton);

    expect(await screen.findByText("Acceptée")).toBeInTheDocument();
  });

  it("declines a received pending request", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<RequestsPage />, { path: "/requests" }));

    await user.click(await screen.findByRole("tab", { name: /Reçues/ }));

    await user.click(await screen.findByRole("button", { name: "Refuser" }));

    expect(await screen.findByText("Refusée")).toBeInTheDocument();
  });

  it("cancels a sent pending request through the confirmation dialog", async () => {
    const user = userEvent.setup();
    render(renderWithRouter(<RequestsPage />, { path: "/requests" }));

    const cancelButtons = await screen.findAllByRole("button", {
      name: "Annuler la demande",
    });
    await user.click(cancelButtons[0]);

    expect(
      await screen.findByRole("heading", { name: "Annuler cette demande ?" }),
    ).toBeInTheDocument();

    // The dialog's confirm button shares the label with the trigger.
    const confirmButtons = screen.getAllByRole("button", {
      name: "Annuler la demande",
    });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() =>
      expect(screen.getAllByText("Refusée").length).toBeGreaterThan(0),
    );
  });
});
