# 🛍️ ShopWish

Aplikasi e-commerce full-stack untuk belanja produk teknologi & gaya hidup premium. Jelajahi katalog, simpan ke wishlist, dan pesan dengan mudah.

---

## 🛠️ Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [React](https://react.dev/) | ^19.2.0 | Library UI utama |
| [Vite](https://vite.dev/) | ^7.3.1 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.1.18 | Utility-first CSS framework |
| [React Router DOM](https://reactrouter.com/) | ^7.13.0 | Client-side routing |
| [Axios](https://axios-http.com/) | ^1.13.5 | HTTP client untuk komunikasi API |
| [Firebase](https://firebase.google.com/) | ^12.9.0 | Google Sign-In authentication |
| [React Icons](https://react-icons.github.io/react-icons/) | ^5.5.0 | Icon library |
| [ESLint](https://eslint.org/) | ^9.39.1 | Linting & code quality |

**Vite Plugins:**
- `@vitejs/plugin-react` ^5.1.1 — Support JSX & React Fast Refresh
- `@tailwindcss/vite` ^4.1.18 — Integrasi Tailwind CSS dengan Vite

**ESLint Plugins:**
- `eslint-plugin-react-hooks` ^7.0.1
- `eslint-plugin-react-refresh` ^0.4.24

---

### Backend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Node.js](https://nodejs.org/) | — | JavaScript runtime (ES Modules) |
| [Express](https://expressjs.com/) | ^5.2.1 | REST API framework |
| [PostgreSQL (pg)](https://node-postgres.com/) | ^8.18.0 | Database driver |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0.3 | JWT authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | ^3.0.3 | Password hashing |
| [firebase-admin](https://firebase.google.com/docs/admin/setup) | ^13.6.1 | Verifikasi Google ID token |
| [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs) | ^10.5.0 | Google auth helper |
| [cors](https://github.com/expressjs/cors) | ^2.8.6 | Cross-Origin Resource Sharing |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.3.1 | Environment variables |

---

### Deployment & Infrastructure

| Teknologi | Kegunaan |
|---|---|
| [Vercel](https://vercel.com/) | Hosting frontend (SPA) & backend (serverless `@vercel/node`) |
| [Neon](https://neon.tech/) | Cloud PostgreSQL database |
| [Firebase](https://firebase.google.com/) | Google Authentication provider |

---

## 📁 Struktur Project

```
Final Project/
├── fe/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigasi utama
│   │   │   ├── ProductCard.jsx      # Card produk
│   │   │   ├── WishlistCard.jsx     # Card wishlist
│   │   │   ├── OrderModal.jsx       # Modal pemesanan
│   │   │   ├── ProtectedRoute.jsx   # Route guard (auth)
│   │   │   ├── ParticleBackground.jsx # Efek partikel canvas
│   │   │   ├── SplashScreen.jsx     # Loading screen awal
│   │   │   └── Toast.jsx            # Notifikasi toast
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Halaman login
│   │   │   ├── RegisterPage.jsx     # Halaman registrasi
│   │   │   ├── CatalogPage.jsx      # Katalog produk
│   │   │   ├── WishlistPage.jsx     # Daftar wishlist
│   │   │   ├── TransactionPage.jsx  # Riwayat transaksi
│   │   │   └── AdminPage.jsx        # Panel admin
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── api.js                   # Axios API instance
│   │   ├── firebase.js              # Firebase config
│   │   ├── index.css                # Tailwind + custom styles
│   │   ├── main.jsx                 # Entry point
│   │   └── App.jsx                  # Root component + routing
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── vercel.json
│   └── package.json
│
├── be/                          # Backend (Express + PostgreSQL)
│   ├── routes/
│   │   ├── auth.js                  # Register, Login, Google Login
│   │   ├── products.js              # Get semua produk
│   │   ├── wishlist.js              # CRUD wishlist (per-user)
│   │   ├── orders.js                # Get & Create order (per-user)
│   │   └── admin.js                 # CRUD produk + approve order
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── db.js                        # PostgreSQL connection pool
│   ├── firebaseAdmin.js             # Firebase Admin SDK setup
│   ├── init.sql                     # Database schema & seed data
│   ├── index.js                     # Express server entry point
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## ✨ Fitur Utama

- 🔐 **Autentikasi** — Register/Login manual + Google Sign-In (Firebase)
- 🛒 **Katalog Produk** — Browsing produk dengan card yang interaktif
- ❤️ **Wishlist** — Simpan produk favorit (per-user)
- 📦 **Pemesanan** — Buat order dengan pilihan metode pembayaran
- 📋 **Riwayat Transaksi** — Lihat semua pesanan & statusnya
- 👑 **Admin Panel** — CRUD produk & approve pesanan
- 🎨 **UI Premium** — Particle background, splash screen, animasi smooth
- 🔒 **Protected Routes** — Halaman terproteksi berdasarkan autentikasi
- 👤 **Per-User Data** — Wishlist & order difilter berdasarkan user yang login

---

## 🗄️ Database Schema

| Tabel | Deskripsi |
|---|---|
| `users` | Data pengguna (name, email, password) |
| `products` | Data produk (name, price, description, image_url) |
| `wishlists` | Wishlist per-user (user_id, product_id) — unique constraint |
| `orders` | Pesanan per-user (product info, quantity, total_price, payment_method, status) |

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (atau gunakan [Neon](https://neon.tech/))
- Firebase project (untuk Google Auth)

### Backend

```bash
cd be
npm install
```

Buat file `.env`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

Jalankan schema SQL:

```bash
# Jalankan init.sql di database PostgreSQL
```

Start server:

```bash
npm run dev
```

### Frontend

```bash
cd fe
npm install
```

Buat file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start dev server:

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

---

## 📝 API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register akun baru | ❌ |
| `POST` | `/api/auth/login` | Login email/password | ❌ |
| `POST` | `/api/auth/google` | Login via Google | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `GET` | `/api/products` | Get semua produk | ✅ |
| `GET` | `/api/wishlist` | Get wishlist user | ✅ |
| `GET` | `/api/wishlist/count` | Get jumlah wishlist | ✅ |
| `POST` | `/api/wishlist` | Tambah ke wishlist | ✅ |
| `DELETE` | `/api/wishlist/:id` | Hapus dari wishlist | ✅ |
| `GET` | `/api/orders` | Get order user | ✅ |
| `POST` | `/api/orders` | Buat order baru | ✅ |
| `POST` | `/api/admin/products` | Tambah produk (admin) | ✅ |
| `PUT` | `/api/admin/products/:id` | Edit produk (admin) | ✅ |
| `DELETE` | `/api/admin/products/:id` | Hapus produk (admin) | ✅ |
| `GET` | `/api/admin/orders` | Get semua order (admin) | ✅ |
| `PUT` | `/api/admin/orders/:id/approve` | Approve order (admin) | ✅ |

---

© 2026 ShopWish. Built with ❤️
