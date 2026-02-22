import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import wishlistRouter from "./routes/wishlist.js";
import ordersRouter from "./routes/orders.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://shopwish-fe.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
