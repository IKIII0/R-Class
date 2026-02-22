import { Router } from "express";
import pool from "../db.js";

const router = Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY order_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST create an order (with quantity & payment method)
router.post("/", async (req, res) => {
  const { product_id, quantity = 1, payment_method = "transfer_bank" } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch product info
    const productResult = await client.query(
      "SELECT * FROM products WHERE id = $1",
      [product_id]
    );
    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];
    const total_price = parseFloat(product.price) * quantity;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (product_id, product_name, product_price, product_image, quantity, total_price, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [product.id, product.name, product.price, product.image_url, quantity, total_price, payment_method]
    );

    // Auto-remove from wishlist if present
    await client.query("DELETE FROM wishlists WHERE product_id = $1", [
      product_id,
    ]);

    await client.query("COMMIT");
    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

export default router;
