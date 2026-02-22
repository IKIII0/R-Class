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
  product_id INTEGER NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(12, 2) NOT NULL,
  product_image TEXT,
  order_date TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Seed 10 Products
-- =============================================
INSERT INTO products (name, price, description, image_url) VALUES
  ('Wireless Bluetooth Headphones', 349000, 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.', 'https://picsum.photos/seed/headphones/400/400'),
  ('Smart Watch Pro', 1299000, 'Advanced smartwatch with heart rate monitor, GPS tracking, sleep analysis, and water resistance up to 50m.', 'https://picsum.photos/seed/smartwatch/400/400'),
  ('Portable Bluetooth Speaker', 459000, 'Compact waterproof speaker with 360° surround sound, 12-hour playtime, and built-in microphone.', 'https://picsum.photos/seed/speaker/400/400'),
  ('Laptop Stand Ergonomic', 279000, 'Adjustable aluminum laptop stand with ventilation holes, supports up to 17-inch laptops. Foldable & portable.', 'https://picsum.photos/seed/laptopstand/400/400'),
  ('Mechanical Keyboard RGB', 599000, 'Compact 75% mechanical keyboard with hot-swappable switches, per-key RGB lighting, and PBT keycaps.', 'https://picsum.photos/seed/keyboard/400/400'),
  ('Wireless Charging Pad', 189000, 'Fast 15W wireless charger compatible with all Qi-enabled devices. Sleek minimalist design with LED indicator.', 'https://picsum.photos/seed/charger/400/400'),
  ('USB-C Hub 7-in-1', 329000, 'Multiport adapter with HDMI 4K, USB 3.0, SD card reader, and 100W PD charging. Aluminum body.', 'https://picsum.photos/seed/usbhub/400/400'),
  ('Noise Cancelling Earbuds', 499000, 'True wireless earbuds with hybrid ANC, transparency mode, 28-hour total battery, and IPX5 water resistance.', 'https://picsum.photos/seed/earbuds/400/400'),
  ('LED Desk Lamp Smart', 399000, 'Touch-controlled desk lamp with 5 color modes, adjustable brightness, USB charging port, and memory function.', 'https://picsum.photos/seed/desklamp/400/400'),
  ('Canvas Backpack Premium', 449000, 'Water-resistant canvas backpack with padded laptop compartment, anti-theft pocket, and USB charging port.', 'https://picsum.photos/seed/backpack/400/400');
