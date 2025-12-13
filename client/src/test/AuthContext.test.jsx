import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AuthProvider, useAuth } from "../context/AuthContext.jsx";
import { resetTestData } from "./msw/handlers.js";

function AuthConsumer() {
  const {
    token,
    user,
    isAuthenticated,
    initialLoading,
    login,
    logout,
  } = useAuth();

  return (
    <div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <div data-testid="initialLoading">{String(initialLoading)}</div>
      <div data-testid="token">{token ?? ""}</div>
      <div data-testid="email">{user?.email ?? ""}</div>

      <button onClick={() => login("test@example.com", "password123")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // Baseline test: no token/user initially
  it("starts unauthenticated when no token exists", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("token").textContent).toBe("");
    expect(screen.getByTestId("email").textContent).toBe("");
    expect(screen.getByTestId("initialLoading").textContent).toBe("false");
  });

  // Supports ProtectedRoute test cases
  // (+ AUTHCTX-TC-03 - token hydration via /auth/me)
  it("hydrates user from existing token on load", async () => {
    localStorage.setItem("token", "token-user-1");

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // loading while /auth/me runs
    expect(screen.getByTestId("initialLoading").textContent).toBe("true");

    // user populated via msw
    expect(
      await screen.findByText("test@example.com")
    ).toBeInTheDocument();

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("initialLoading").textContent).toBe("false");
  });

  // AUTHCTX-TC-01
  it("login stores token and populates user", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toMatch(/^token-/);
    });

    expect(
      await screen.findByText("test@example.com")
    ).toBeInTheDocument();

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
  });

  // AUTHCTX-TC-02
  it("logout clears token and user state", async () => {
    localStorage.setItem("token", "token-user-1");

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(
      await screen.findByText("test@example.com")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
      expect(screen.getByTestId("token").textContent).toBe("");
      expect(screen.getByTestId("email").textContent).toBe("");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  // AUTHCTX-TC-03 - failed /auth/me clears token
  it("clears invalid token on failed /auth/me", async () => {
    localStorage.setItem("token", "invalid-token");

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});