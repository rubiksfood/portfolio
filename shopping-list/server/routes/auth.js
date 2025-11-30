import express from "express";
import db from "../db/connection.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const usersCollection = await db.collection("users");

    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await usersCollection.insertOne({
      email,
      passwordHash,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});