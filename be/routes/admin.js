import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "shopwish_secret_key_2026";
const ADMIN_EMAIL = "shopwish@gmail.com";

// Middleware: verify token + admin check
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Akses ditolak. Hanya admin." });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
};

// POST /api/admin/products — tambah produk baru
router.post("/products", requireAdmin, async (req, res) => {
  const { name, price, description, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nama dan harga produk harus diisi" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, description || "", image_url || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Gagal menambahkan produk" });
  }
});

// PUT /api/admin/products/:id — update produk
router.put("/products/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nama dan harga produk harus diisi" });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, price, description || "", image_url || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Gagal mengupdate produk" });
  }
});

// DELETE /api/admin/products/:id — hapus produk
router.delete("/products/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});

// GET /api/admin/orders — semua orders (untuk admin)
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY order_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching admin orders:", err);
    res.status(500).json({ error: "Gagal memuat pesanan" });
  }
});

// PUT /api/admin/orders/:id/approve — approve order
router.put("/orders/:id/approve", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE orders SET status = 'selesai' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error approving order:", err);
    res.status(500).json({ error: "Gagal mengkonfirmasi pesanan" });
  }
});

export default router;
