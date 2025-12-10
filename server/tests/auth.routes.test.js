import request from "supertest";
import app from "../app.js";
import db, { client } from "../db/connection.js";
import { clearDatabase } from "./setup.js";

describe("Auth routes", () => {
  beforeAll(async () => {
    // Connection is created in connection.js
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await client.close();
  });

  describe("POST /auth/register", () => {
    it("creates a user with a valid email and password", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User created");
    });

    it("rejects duplicate email", async () => {
      // First registration
      await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      // Second registration
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.statusCode).toBe(409);
    });

    it("rejects missing fields", async () => {
      const res = await request(app)
      .post("/auth/register")
      .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    it("returns token for valid credentials", async () => {
      // Create user
      await request(app)
        .post("/auth/register")
        .send({ email: "login@example.com", password: "secret123" });

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "login@example.com", password: "secret123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("rejects invalid credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "reject@example.com", password: "wrong" });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /auth/me", () => {
    it("returns user info for a valid token", async () => {
      const registerRes = await request(app)
        .post("/auth/register")
        .send({ email: "me@example.com", password: "secret123" });

      const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: "me@example.com", password: "secret123" });

      const token = loginRes.body.token;

      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("email", "me@example.com");
      expect(res.body).not.toHaveProperty("passwordHash");
    });

    it("rejects requests without a token", async () => {
      const res = await request(app).get("/auth/me");
      expect(res.statusCode).toBe(401);
    });
  });
});