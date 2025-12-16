import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import { renderWithProviders } from "./testUtilities.jsx";
import { resetTestData } from "./msw/handlers.js";
import { RoutesHarness } from "./RoutesHarness.jsx";

function HomeStub() {
  return <h1>Home Page</h1>;
}

function LoginStub() {
  return <h1>Login Page</h1>;
}

function RegisterStub() {
  return <h1>Register Page</h1>;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function renderNavbar({ route = "/", token = null } = {}) {
  return renderWithProviders(
    <RoutesHarness
      routes={[
        {
          path: "/",
          element: (
            <>
              <Navbar />
              <HomeStub />
            </>
          ),
        },
        { path: "/login", element: <LoginStub /> },
        { path: "/register", element: <RegisterStub /> },
      ]}
    />,
    { route, token }
  );
}

describe("Navbar (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // NAV-TC-01 / TCON-NAV-UI-01
  it("shows Login and Register when logged out", () => {
    renderNavbar({ token: null });

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
  });

  // NAV-TC-02 / TCON-NAV-UI-01
  it("shows Logout (and user email) when logged in", async () => {
    renderNavbar({ token: "token-user-1" });

    // logout button should appear immediately because isAuthenticated = !!token
    expect(await screen.findByRole("button", { name: /logout/i })).toBeInTheDocument();

    // email appears once /auth/me resolves and user is set
    expect(await screen.findByText("test@example.com")).toBeInTheDocument();

    // login/register should not be visible while authenticated
    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /register/i })).not.toBeInTheDocument();
  });

  // NAV-TC-03 + NAV-TC-04 / TCON-NAV-ACT-01 + TCON-NAV-ACT-02
  it("clicking Logout clears auth state and navigates to /login", async () => {
    const user = userEvent.setup();
  
    renderWithProviders(
    <RoutesHarness
      routes={[
        {
          path: "/",
          element: <Layout />,
          children: [
            { path: "/", element: <HomeStub /> },
            { path: "/login", element: <LoginStub /> },
            { path: "/register", element: <RegisterStub /> },
          ],
        },
      ]}
    />,
    { route: "/", token: "token-user-1" }
  );

    // wait until user hydrated to check AuthProvider is fully running
    expect(await screen.findByText("test@example.com")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    // token cleared
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });

    // navigates to /login
    expect(await screen.findByText("Login Page")).toBeInTheDocument();

    // navbar should now show logged-out buttons
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });
});