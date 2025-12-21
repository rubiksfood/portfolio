import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

// Use a different DB for testing
const env = process.env.NODE_ENV;

// Prefer an explicit DB name if provided (useful for CI/E2E)
const dbName =
  process.env.DB_NAME || 
  (env === "test" 
    ? "shopping_list_test" 
    : env === "e2e"
      ? "shopping_list_test_e2e"
      : "shopping_list");

let db = client.db(dbName);

export { client };
export default db;