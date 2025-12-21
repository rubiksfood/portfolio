import { MongoClient, ServerApiVersion } from "mongodb";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const ATLAS_URI = requireEnv("ATLAS_URI");

// Set this to a dedicated E2E DB name (NEVER prod!)
const E2E_DB_NAME = process.env.E2E_DB_NAME || "shopping_list_test_e2e";

// Collections used by the app
const COLLECTIONS_TO_CLEAR = ["users", "shopItems"];

// Safety: refuse to run on suspicious DB names
const FORBIDDEN = ["shopping_list", "prod", "production", "main"];
const looksForbidden =
  FORBIDDEN.includes(E2E_DB_NAME) ||
  E2E_DB_NAME.toLowerCase().includes("prod") ||
  E2E_DB_NAME.toLowerCase() === "shopping_list";

if (looksForbidden) {
  console.error(
    `Refusing to reset database "${E2E_DB_NAME}". Use a dedicated E2E DB name (e.g. shopping_list_test_e2e).`
  );
  process.exit(1);
}

async function main() {
  const client = new MongoClient(ATLAS_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(E2E_DB_NAME);

    // Verify we can ping
    await client.db("admin").command({ ping: 1 });

    // Clear known collections (don't drop DB; keep indexes, should we add them later)
    for (const name of COLLECTIONS_TO_CLEAR) {
      const collection = db.collection(name);
      await collection.deleteMany({});
    }

    console.log(
      `✅ E2E DB reset complete. Cleared: ${COLLECTIONS_TO_CLEAR.join(
        ", "
      )} in DB "${E2E_DB_NAME}".`
    );
  } catch (err) {
    console.error("❌ E2E DB reset failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

await main();