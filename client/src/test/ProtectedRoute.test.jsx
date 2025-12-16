import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { renderWithProviders } from "./testUtilities.jsx";
import { resetTestData } from "./msw/handlers.js";
import { RoutesHarness } from "./RoutesHarness.jsx";
import { server } from "./msw/server.js";

function LoginPage() {
  return <h1>Login Page</h1>;
}

function ProtectedContent() {
  return <h1>Protected Content</h1>;
}

describe("ProtectedRoute (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // ROUTE-PROT-TC-01
  it("redirects unauthenticated users to /login", async () => {
    renderWithProviders(
      <RoutesHarness
        routes={[
          { path: "/login", element: <LoginPage /> },
          {
            // ProtectedRoute uses <Outlet />, so it MUST have a child route(!)
            path: "/",
            element: <ProtectedRoute />,
            children: [{ path: "/", element: <ProtectedContent /> }],
          },
        ]}
      />,
      { route: "/" }
    );

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  // ROUTE-PROT-TC-02
  it("shows loading state while validating token, then renders protected content", async () => {
    // Force /auth/me to be slow so Loading is observable and stable
  server.use(
    http.get("http://localhost:5050/auth/me", async () => {
      await new Promise((r) => setTimeout(r, 50));
      return HttpResponse.json({ _id: "user-1", email: "test@example.com" }, { status: 200 });
    })
  );
    renderWithProviders(
      <RoutesHarness
        routes={[
          { path: "/login", element: <LoginPage /> },
          {
            path: "/",
            element: <ProtectedRoute />,
            children: [{ path: "/", element: <ProtectedContent /> }],
          },
        ]}
      />,
      {
        route: "/",
        token: "token-user-1", // handled by MSW /auth/me
      }
    );

    // During AuthProvider token validation
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();

    // After /auth/me succeeds
    expect(await screen.findByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});