import { Router } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/admin/products — tambah produk baru
router.post("/products", async (req, res) => {
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
router.put("/products/:id", async (req, res) => {
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
router.delete("/products/:id", async (req, res) => {
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

export default router;
