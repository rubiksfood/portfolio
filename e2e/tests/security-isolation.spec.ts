import { test, expect } from "@playwright/test";
import { createApiContext, register, login, createItem, uniqueEmail } from "../utils/api";
import { clearSession, setTokenBeforeLoad } from "../utils/auth";

const PASSWORD = "Password123!";

test.describe("Security / Data Isolation (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  // E2E-SEC-TC-01
  test("User A cannot see User B’s items", async ({ page }) => {
    const api = await createApiContext();

    // User A
    const emailA = uniqueEmail("userA");
    await register(api, emailA, PASSWORD);
    const tokenA = await login(api, emailA, PASSWORD);
    await createItem(api, tokenA, { name: "A-only", amount: "1", notes: "" });

    // User B
    const emailB = uniqueEmail("userB");
    await register(api, emailB, PASSWORD);
    const tokenB = await login(api, emailB, PASSWORD);
    await createItem(api, tokenB, { name: "B-only", amount: "1", notes: "" });

    // Login as User A in the browser
    await setTokenBeforeLoad(page, tokenA);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Your Shopping List" })).toBeVisible();

    await expect(page.getByText("A-only")).toBeVisible();
    await expect(page.getByText("B-only")).toHaveCount(0);

    await api.dispose();
  });
});