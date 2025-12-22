import { test, expect } from "@playwright/test";
import { createApiContext, register, login, uniqueEmail } from "../utils/api";
import { clearSession, loginViaUI, logoutViaUI } from "../utils/auth";

const PASSWORD = "Password123!";

test.describe("Routing & Authentication (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  // E2E-ROUTE-TC-01
  test("Unauthenticated access to / redirects to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  // E2E-AUTH-TC-01
  test("Login persists token and grants access to protected home route", async ({ page }) => {
    const api = await createApiContext();
    const email = uniqueEmail("login");
    await register(api, email, PASSWORD);

    await loginViaUI(page, email, PASSWORD);

    // token should be stored
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();

    // shopping list UI visible (protected content)
    await expect(page.getByRole("heading", { name: "Your Shopping List" })).toBeVisible();
    await api.dispose();
  });

  // E2E-AUTH-TC-02
  test("Logout clears token and redirects to /login", async ({ page }) => {
    const api = await createApiContext();
    const email = uniqueEmail("logout");
    await register(api, email, PASSWORD);

    await loginViaUI(page, email, PASSWORD);

    await logoutViaUI(page);

    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeNull();

    await api.dispose();
  });
});