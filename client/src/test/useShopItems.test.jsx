import { describe, it, expect, beforeEach, vi } from "vitest";
import { waitFor, renderHook, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";

import { AuthProvider } from "../context/AuthContext.jsx";
import { useShopItems } from "../hooks/useShopItems.js";
import { server } from "./msw/server.js";
import { resetTestData } from "./msw/handlers.js";

// To match MSW handlers base URL
const API_BASE_URL = "http://localhost:5050";

function wrapperWithAuth(route = "/") {
  return function Wrapper({ children }) {
    return (
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AuthProvider>
    );
  };
}

describe("useShopItems (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // HOOK-ITEMS-TC-01 / TCON-HOOK-ITEMS-01
  it("fetches items on mount when token exists", async () => {
    localStorage.setItem("token", "token-user-1");

    const { result } = renderHook(() => useShopItems(), {
      wrapper: wrapperWithAuth("/"),
    });

    // Eventually items returned by MSW should be present
    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    });

    expect(result.current.items[0].name).toBe("Oat drink");
    expect(result.current.loading).toBe(false);
  });

  // HOOK-ITEMS-TC-02 / TCON-HOOK-ITEMS-02
  it("handles loading state: starts loading, then becomes false after fetch resolves", async () => {
    localStorage.setItem("token", "token-user-1");

    // Override GET /shopItem to be intentionally slow for this test
    server.use(
      http.get(`${API_BASE_URL}/shopItem`, async ({ request }) => {
        // small delay to make "loading=true" observable
        await new Promise((r) => setTimeout(r, 50));

        const auth = request.headers.get("authorization") ?? "";
        if (!auth.includes("token-user-1")) {
          return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        // return the default dataset
        return HttpResponse.json(
          [
            {
              _id: "item-1",
              name: "Oat drink",
              amount: "2",
              notes: "Barista edition",
              isChecked: false,
              userId: "user-1",
            },
          ],
          { status: 200 }
        );
      })
    );

    const { result } = renderHook(() => useShopItems(), {
      wrapper: wrapperWithAuth("/"),
    });

    // Immediately after mount, we expect loading true (initial state)
    expect(result.current.loading).toBe(true);

    // After fetch resolves
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items[0].name).toBe("Oat drink");
  });

  // HOOK-ITEMS-TC-03 / TCON-HOOK-ITEMS-03
  it("handles API/network errors gracefully (logs error, sets loading as false, leaves items unchanged)", async () => {
    localStorage.setItem("token", "token-user-1");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Force GET /shopItem to return 500
    server.use(
      http.get(`${API_BASE_URL}/shopItem`, () => {
        return HttpResponse.text("Server error", { status: 500 });
      })
    );

    const { result } = renderHook(() => useShopItems(), {
      wrapper: wrapperWithAuth("/"),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Implementation logs error; it does not expose an `error` state
    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.items).toEqual([]);

    consoleSpy.mockRestore();
  });

  // HOOK-ITEMS-TC-04 / TCON-HOOK-ITEMS-04
  it("updates items after create, update/toggle, and delete", async () => {
    localStorage.setItem("token", "token-user-1");

    const { result } = renderHook(() => useShopItems(), {
      wrapper: wrapperWithAuth("/"),
    });

    // baseline fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.items.length).toBe(1);
    });

    // CREATE
    await act(async () => {
      await result.current.addItem({
        name: "Apples",
        amount: "6",
        notes: "Granny Smith",
        isChecked: false,
      });
    });

    await waitFor(() => {
      expect(result.current.items.some((i) => i.name === "Apples")).toBe(true);
    });

    const apples = result.current.items.find((i) => i.name === "Apples");
    expect(apples).toBeTruthy();

    // UPDATE (via toggleCheck)
    await act(async () => {
      await result.current.toggleCheck(apples._id, true);
    });

    await waitFor(() => {
      const updated = result.current.items.find((i) => i._id === apples._id);
      expect(updated.isChecked).toBe(true);
    });

    // DELETE
    await act(async () => {
      await result.current.deleteItem(apples._id);
    });

    await waitFor(() => {
      expect(result.current.items.some((i) => i._id === apples._id)).toBe(false);
    });
  });
});