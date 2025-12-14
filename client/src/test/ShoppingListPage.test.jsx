import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "./testUtilities.jsx";
import { RoutesHarness } from "./RoutesHarness.jsx";
import ShoppingListPage from "../pages/ShoppingListPage.jsx";

// Mock the hook used by ShoppingList
import * as hookModule from "../hooks/useShopItems.js";

function renderShoppingListPage({ route = "/" } = {}) {
  return renderWithProviders(
    <RoutesHarness routes={[{ path: "/", element: <ShoppingListPage /> }]} />,
    { route, token: "token-user-1" } // token is irrelevant as hook is mocked
  );
}

describe("ShoppingListPage / ShoppingList", () => {
  const toggleCheck = vi.fn();
  const deleteItem = vi.fn();
  const addItem = vi.fn();
  const updateItem = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    toggleCheck.mockReset();
    deleteItem.mockReset();
    addItem.mockReset();
    updateItem.mockReset();
  });

  // TCON-COMP-LIST-01 → COMP-LIST-TC-01
  it("renders list items returned from hook", () => {
    vi.spyOn(hookModule, "useShopItems").mockReturnValue({
      items: [
        {
          _id: "item-1",
          name: "Oat drink",
          amount: "2",
          notes: "Barista edition",
          isChecked: false,
        },
      ],
      loading: false,
      addItem,
      updateItem,
      deleteItem,
      toggleCheck,
      refresh: vi.fn(),
    });

    renderShoppingListPage();

    expect(screen.getByText(/your shopping list/i)).toBeInTheDocument();
    expect(screen.getByText("Oat drink")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Barista edition")).toBeInTheDocument();
  });

  // COMP-LIST-TC-02 / TCON-COMP-LIST-02
it("handles empty list without errors (no item rows rendered)", () => {
  vi.spyOn(hookModule, "useShopItems").mockReturnValue({
    items: [],
    loading: false,
    addItem,
    updateItem,
    deleteItem,
    toggleCheck,
    refresh: vi.fn(),
  });

  renderShoppingListPage();

  // Each item row has a "Delete" button per item - no item rows means no "Delete" buttons.
  expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
});


  // TCON-COMP-ITEM-01 → COMP-LIST-TC-03
  it("toggling an item calls toggleCheck with correct id and new isChecked", async () => {
    const user = userEvent.setup();

    vi.spyOn(hookModule, "useShopItems").mockReturnValue({
      items: [
        {
          _id: "item-1",
          name: "Eggs",
          amount: "10",
          notes: "",
          isChecked: false,
        },
      ],
      loading: false,
      addItem,
      updateItem,
      deleteItem,
      toggleCheck,
      refresh: vi.fn(),
    });

    renderShoppingListPage();

    // ToggleSwitch renders a checkbox input
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // ShoppingList passes toggleCheck(shopItem._id, !shopItem.isChecked)
    expect(toggleCheck).toHaveBeenCalledTimes(1);
    expect(toggleCheck).toHaveBeenCalledWith("item-1", true);
  });

  // TCON-COMP-ITEM-02 → COMP-LIST-TC-04
  it("clicking Delete calls deleteItem with correct id", async () => {
    const user = userEvent.setup();

    vi.spyOn(hookModule, "useShopItems").mockReturnValue({
      items: [
        {
          _id: "item-1",
          name: "Milk",
          amount: "2",
          notes: "",
          isChecked: false,
        },
      ],
      loading: false,
      addItem,
      updateItem,
      deleteItem,
      toggleCheck,
      refresh: vi.fn(),
    });

    renderShoppingListPage();

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    // ShoppingList passes deleteItem to row as deleteShopItem and calls deleteShopItem(shopItem._id)
    expect(deleteItem).toHaveBeenCalledTimes(1);
    expect(deleteItem).toHaveBeenCalledWith("item-1");
  });
});