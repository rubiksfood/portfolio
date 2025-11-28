import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import shopItems from "./routes/shopItem.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/shopItem", shopItems);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});