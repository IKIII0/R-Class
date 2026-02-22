-- =============================================
-- ShopWish Database Schema & Seed Data
-- Run this on your Neon database
-- =============================================

-- Drop existing tables (if any)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  image_url TEXT
);

-- Wishlists Table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(12, 2) NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'transfer_bank',
  status VARCHAR(20) NOT NULL DEFAULT 'proses',
  order_date TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Seed 10 Products
-- =============================================
INSERT INTO products (name, price, description, image_url) VALUES
  ('Wireless Bluetooth Headphones', 349000, 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'),
  ('Smart Watch Pro', 1299000, 'Advanced smartwatch with heart rate monitor, GPS tracking, sleep analysis, and water resistance up to 50m.', 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop'),
  ('Portable Bluetooth Speaker', 459000, 'Compact waterproof speaker with 360 surround sound, 12-hour playtime, and built-in microphone.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'),
  ('Laptop Stand Ergonomic', 279000, 'Adjustable aluminum laptop stand with ventilation holes, supports up to 17-inch laptops. Foldable and portable.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'),
  ('Mechanical Keyboard RGB', 599000, 'Compact 75% mechanical keyboard with hot-swappable switches, per-key RGB lighting, and PBT keycaps.', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop'),
  ('Wireless Charging Pad', 189000, 'Fast 15W wireless charger compatible with all Qi-enabled devices. Sleek minimalist design with LED indicator.', 'https://images.unsplash.com/photo-1622957461168-6ea4ff760a0d?w=400&h=400&fit=crop'),
  ('USB-C Hub 7-in-1', 329000, 'Multiport adapter with HDMI 4K, USB 3.0, SD card reader, and 100W PD charging. Aluminum body.', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop'),
  ('Noise Cancelling Earbuds', 499000, 'True wireless earbuds with hybrid ANC, transparency mode, 28-hour total battery, and IPX5 water resistance.', 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop'),
  ('LED Desk Lamp Smart', 399000, 'Touch-controlled desk lamp with 5 color modes, adjustable brightness, USB charging port, and memory function.', 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop'),
  ('Canvas Backpack Premium', 449000, 'Water-resistant canvas backpack with padded laptop compartment, anti-theft pocket, and USB charging port.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop');
