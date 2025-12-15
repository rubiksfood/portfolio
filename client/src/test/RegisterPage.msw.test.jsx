import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import { renderWithProviders } from "./testUtilities.jsx";
import { resetTestData } from "./msw/handlers.js";
import { RoutesHarness } from "./RoutesHarness.jsx";

function renderRegister({ route = "/register", token = null } = {}) {
  return renderWithProviders(
    <RoutesHarness
      routes={[
        { path: "/register", element: <RegisterPage /> },
        { path: "/login", element: <LoginPage /> },
      ]}
    />,
    { route, token }
  );
}

describe("RegisterPage (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // AUTHUI-REG-TC-01 / TCON-AUTHUI-INPUT-01
  // Validation exists for required fields (best-practice: assert required attributes)
  it("marks email & password as required inputs", () => {
    renderRegister();

    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });

  // AUTHUI-REG-TC-02 + AUTHUI-REG-TC-04 / TCON-AUTHUI-SUBMIT-02 + TCON-AUTHUI-NAV-02:
  // Valid registration triggers API call and redirects to /login
  it("registers successfully and redirects to /login", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    // RegisterPage navigates to /login after success
    expect(await screen.findByRole("button", { name: /^login$/i })).toBeInTheDocument();

    // Register should not set a token
    expect(localStorage.getItem("token")).toBeNull();
  });

  // AUTHUI-REG-TC-03 / TCON-AUTHUI-ERR-01 (registration error variant):
  // Duplicate email yields a user-visible error
  it("shows error when email already exists", async () => {
    const user = userEvent.setup();
    renderRegister();

    // Default MSW dataset contains test@example.com already
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    expect(await screen.findByText(/user already exists/i)).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });

  // (Spec support) Link back to Login page
  it("supports navigation: provides a link to /login", () => {
    renderRegister();

    const link = screen.getByRole("link", { name: /^login$/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});