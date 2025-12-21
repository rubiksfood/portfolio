import * as path from "node:path";
import * as dotenv from "dotenv";
import { execSync } from "node:child_process";

async function globalSetup() {
  const result = dotenv.config({
    path: path.resolve(process.cwd(), "e2e/config.e2e.env"),
  });

  if (result.error) {
    throw new Error("Failed to load e2e/config.e2e.env");
  }

  if (!process.env.ATLAS_URI) {
    throw new Error("ATLAS_URI is not set for E2E tests");
  }

  // Run reset script
  execSync("node e2e/utils/reset-db.mjs", { stdio: "inherit" });
}

export default globalSetup;