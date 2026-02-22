import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = () => API.get("/products");

// Admin — Product CRUD
export const createProduct = (data) => API.post("/admin/products", data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);

// Wishlist
export const getWishlist = () => API.get("/wishlist");
export const getWishlistCount = () => API.get("/wishlist/count");
export const addToWishlist = (product_id) =>
  API.post("/wishlist", { product_id });
export const removeFromWishlist = (productId) =>
  API.delete(`/wishlist/${productId}`);

// Orders
export const getOrders = () => API.get("/orders");
export const createOrder = (product_id, quantity, payment_method) =>
  API.post("/orders", { product_id, quantity, payment_method });

// Auth
export const registerUser = (name, email, password) =>
  API.post("/auth/register", { name, email, password });
export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });
export const googleLogin = (idToken) =>
  API.post("/auth/google", { idToken });
export const getMe = () => API.get("/auth/me");

export default API;
