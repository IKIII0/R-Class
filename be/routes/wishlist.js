import { Router } from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// GET all wishlist items for current user
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id as wishlist_id, w.product_id, w.created_at,
              p.name, p.price, p.description, p.image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// GET wishlist count for current user
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM wishlists WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Error fetching wishlist count:", err);
    res.status(500).json({ error: "Failed to fetch wishlist count" });
  }
});

// POST add product to wishlist
router.post("/", async (req, res) => {
  const { product_id } = req.body;
  try {
    // Check if already in this user's wishlist
    const existing = await pool.query(
      "SELECT id FROM wishlists WHERE product_id = $1 AND user_id = $2",
      [product_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Product already in wishlist" });
    }

    const result = await pool.query(
      "INSERT INTO wishlists (product_id, user_id) VALUES ($1, $2) RETURNING *",
      [product_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE remove product from wishlist
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM wishlists WHERE product_id = $1 AND user_id = $2 RETURNING *",
      [productId, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }
    res.json({ message: "Removed from wishlist", data: result.rows[0] });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
