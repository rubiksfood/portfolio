import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import shopItems from "./routes/shopItem.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/shopItem", shopItems);

export default app;