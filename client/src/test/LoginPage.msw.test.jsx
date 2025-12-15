import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "../pages/LoginPage.jsx";
import { renderWithProviders } from "./testUtilities.jsx";
import { resetTestData } from "./msw/handlers.js";
import { RoutesHarness } from "./RoutesHarness.jsx";

function Home() {
  return <h1>Home Page</h1>;
}

function RegisterStub() {
  return <h1>Register Page</h1>;
}

function renderLogin({ route = "/login", token = null } = {}) {
  return renderWithProviders(
    <RoutesHarness
      routes={[
        { path: "/", element: <Home /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterStub /> },
      ]}
    />,
    { route, token }
  );
}

describe("LoginPage (MSW)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetTestData?.();
  });

  // AUTHUI-LOGIN-TC-01 / TCON-AUTHUI-INPUT-01
  // Validation exists for required fields (best-practice: assert required attributes)
  it("marks email & password as required inputs", () => {
    renderLogin();

    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });

  // AUTHUI-LOGIN-TC-02 / TCON-AUTHUI-INPUT-02
  // Invalid email formats are constrained (best-practice: assert type=email)
  it("uses an email input (supports browser-level email validation)", () => {
    renderLogin();

    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  // AUTHUI-LOGIN-TC-03 + AUTHUI-LOGIN-TC-05 / TCON-AUTHUI-SUBMIT-01 + TCON-AUTHUI-NAV-01:
  it("logs in successfully and navigates to '/'", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText("Home Page")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toMatch(/^token-/);
  });

  // AUTHUI-LOGIN-TC-04 / TCON-AUTHUI-ERR-01
  it("shows error on invalid credentials", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });

  // (Spec support) Link to Register page
  it("supports navigation: provides a link to /register", () => {
    renderLogin();

    const link = screen.getByRole("link", { name: /register/i });
    expect(link).toHaveAttribute("href", "/register");
  });
});