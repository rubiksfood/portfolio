import { execSync } from "node:child_process";

try {
  execSync("docker info", { stdio: "ignore" });
  process.exit(0);
} catch {
  console.error("Docker is not running (or not available to this process).");
  process.exit(1);
}