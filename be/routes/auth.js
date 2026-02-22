import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../firebaseAdmin.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "shopwish_secret_key_2026";
const ADMIN_EMAIL = "shopwish@gmail.com";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi berhasil", user: result.rows[0] });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Gagal mendaftar" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password harus diisi" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isAdmin = user.email === ADMIN_EMAIL;
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Gagal login" });
  }
});

// POST /api/auth/google — Firebase Google sign-in
router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Firebase token tidak ditemukan" });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user already exists
    let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      // Create new user (no password needed for Google users)
      result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name || email.split("@")[0], email, `firebase_${uid}`]
      );
    }

    const user = result.rows[0];

    const isAdmin = user.email === ADMIN_EMAIL;
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin },
    });
  } catch (err) {
    console.error("Error with Firebase Google auth:", err);
    res.status(401).json({ error: "Google authentication gagal" });
  }
});

// GET /api/auth/me — validate token & return user data
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const userData = result.rows[0];
    userData.isAdmin = userData.email === ADMIN_EMAIL;
    res.json(userData);
  } catch (err) {
    return res.status(401).json({ error: "Token tidak valid" });
  }
});

export default router;
