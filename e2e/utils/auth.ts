import { Page, expect } from "@playwright/test";

export async function clearSession(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export async function setTokenBeforeLoad(page: Page, token: string) {
  // Ensure token exists before React loads (AuthContext reads localStorage on init)
  await page.addInitScript((t) => {
    localStorage.setItem("token", t);
  }, token);
}

export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/$/);
}

export async function logoutViaUI(page: Page) {
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);
}