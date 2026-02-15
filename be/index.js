import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import wishlistRouter from "./routes/wishlist.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
