import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE-ME";

function createTestApp() {
  const app = express();
  app.get("/protected", auth, (req, res) => {
    res.json({ userId: req.userId });
  });
  return app;
}

describe("auth middleware", () => {
  const app = createTestApp();

  it("rejects when Authorization header is missing", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Authorization header missing");
  });

  it("rejects when header is not Bearer", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Token abc");

    expect(res.statusCode).toBe(401);
  });

  it("rejects invalid token", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token");

    expect(res.statusCode).toBe(401);
  });

  it("accepts valid token and sets req.userId", async () => {
    const token = jwt.sign({ userId: "12345" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userId", "12345");
  });
});