import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET all wishlist items (joined with products)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id as wishlist_id, w.product_id, w.created_at,
              p.name, p.price, p.description, p.image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       ORDER BY w.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// GET wishlist count
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM wishlists");
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
    // Check if already in wishlist
    const existing = await pool.query(
      "SELECT id FROM wishlists WHERE product_id = $1",
      [product_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Product already in wishlist" });
    }

    const result = await pool.query(
      "INSERT INTO wishlists (product_id) VALUES ($1) RETURNING *",
      [product_id]
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
      "DELETE FROM wishlists WHERE product_id = $1 RETURNING *",
      [productId]
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
