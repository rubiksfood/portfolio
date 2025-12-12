import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";

// Renders UI wrapped in AuthProvider + MemoryRouter
// Options:
// - route: initial route for MemoryRouter
// - token: seeds localStorage token before render (AuthProvider reads it on mount)

export function renderWithProviders(ui, { route = "/", token = null } = {}) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthProvider>
  );
}