import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Products
export const getProducts = () => API.get("/products");

// Wishlist
export const getWishlist = () => API.get("/wishlist");
export const getWishlistCount = () => API.get("/wishlist/count");
export const addToWishlist = (product_id) =>
  API.post("/wishlist", { product_id });
export const removeFromWishlist = (productId) =>
  API.delete(`/wishlist/${productId}`);

// Orders
export const getOrders = () => API.get("/orders");
export const createOrder = (product_id) =>
  API.post("/orders", { product_id });

export default API;
