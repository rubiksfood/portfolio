import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  testMatch: /.*\.spec\.(ts)/,
  testIgnore: [
    "**/node_modules/**",
    "**/client/**",
    "**/server/**",
    "**/dist/**",
    "**/build/**",
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  globalSetup: "./e2e/global-setup.ts",
});
