import { test, expect } from "@playwright/test";
import { createApiContext, register, login, uniqueEmail } from "../utils/api";
import { clearSession, setTokenBeforeLoad } from "../utils/auth";

const PASSWORD = "Password123!";

test.describe("Shopping List Core Functionality (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  async function loginFastAndOpenHome(page: any) {
    const api = await createApiContext();
    const email = uniqueEmail("items");

    await register(api, email, PASSWORD);
    const token = await login(api, email, PASSWORD);

    await setTokenBeforeLoad(page, token);

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Your Shopping List" })).toBeVisible();

    return { api, email };
  }

  async function openAddItemDialog(page: any) {
    // Click the 'add Item' button to open the modal/dialog
    await page.getByRole("button", { name: /^\+ Add item$/ }).click();

    const dialog = page.getByRole("dialog", { name: /add item/i });
    await expect(dialog).toBeVisible();

    return dialog;
  }

  // E2E-ITEM-TC-01
  test("Add item appears in list", async ({ page }) => {
    const { api } = await loginFastAndOpenHome(page);

    const itemName = `Eggs ${Date.now()}`;

    const dialog = await openAddItemDialog(page);

    await dialog.getByLabel("Name").fill(itemName);
    await dialog.getByLabel("Amount").fill("2");
    await dialog.getByLabel("Notes").fill("Semi-skimmed");

    // IMPORTANT: click the Add item button INSIDE the dialog
    await dialog.getByRole("button", { name: /^Add item$/ }).click();

    // Dialog should close after save
    await expect(dialog).toBeHidden();

    // Assert item row exists
    const row = page.locator("tr", { hasText: itemName });
    await expect(row).toBeVisible();

    await api.dispose();
  });

  // E2E-ITEM-TC-02
  test("Delete item removes it from list", async ({ page }) => {
    const { api } = await loginFastAndOpenHome(page);

    const itemName = `DeleteMe ${Date.now()}`;

    const dialog = await openAddItemDialog(page);

    await dialog.getByLabel("Name").fill(itemName);
    await dialog.getByRole("button", { name: /^Add item$/ }).click();
    await expect(dialog).toBeHidden();

    const row = page.locator("tr", { hasText: itemName });
    await expect(row).toBeVisible();

    // Click Delete inside the row
    await row.getByRole("button", { name: /^Delete$/ }).click();

    // Row should disappear
    await expect(row).toHaveCount(0);

    await api.dispose();
  });
});