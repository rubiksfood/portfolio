import db, { client } from "../db/connection.js";

export async function clearDatabase() {
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

export async function closeDatabase() {
  await client.close();
}