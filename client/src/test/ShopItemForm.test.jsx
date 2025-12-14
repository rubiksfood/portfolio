import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ShopItemForm from "../components/ShopItemForm.jsx";
import { renderWithProviders } from "./testUtilities.jsx";

describe("ShopItemForm", () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    onSubmit.mockReset();
    onCancel.mockReset();
  });

  // TCON-COMP-FORM-01 → COMP-FORM-TC-01
  it("enforces required Name field via HTML constraint validation", () => {
    renderWithProviders(
      <ShopItemForm initialItem={null} onSubmit={onSubmit} onCancel={onCancel} />,
      { route: "/" }
    );

    const nameInput = screen.getAllByRole("textbox")[0];
    expect(nameInput).toBeRequired();
  });

  // TCON-COMP-FORM-02 → COMP-FORM-TC-02
  it("submits valid data via onSubmit callback", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ShopItemForm initialItem={null} onSubmit={onSubmit} onCancel={onCancel} />,
      { route: "/" }
    );

    const [nameInput, amountInput, notesInput] = screen.getAllByRole("textbox");

    await user.type(nameInput, "Apples");
    await user.type(amountInput, "6");
    await user.type(notesInput, "Granny Smith");

    await user.click(screen.getByRole("button", { name: /add item/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Apples",
      amount: "6",
      notes: "Granny Smith",
      isChecked: false,
    });
  });

  // (Spec support) edit mode populates fields and button text changes
  it("supports edit mode: pre-populates fields and uses 'Save changes' button", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ShopItemForm
        initialItem={{ name: "Bread", amount: "1", notes: "Wholegrain", isChecked: true }}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
      { route: "/" }
    );

    expect(screen.getByText(/edit item/i)).toBeInTheDocument();

    const [nameInput, amountInput, notesInput] = screen.getAllByRole("textbox");

    expect(nameInput).toHaveValue("Bread");
    expect(amountInput).toHaveValue("1");
    expect(notesInput).toHaveValue("Wholegrain");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Bread",
      amount: "1",
      notes: "Wholegrain",
      isChecked: true,
    });
  });

  it("supports cancel: calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ShopItemForm initialItem={null} onSubmit={onSubmit} onCancel={onCancel} />,
      { route: "/" }
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});