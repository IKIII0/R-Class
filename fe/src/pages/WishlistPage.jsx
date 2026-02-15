import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist, createOrder } from "../api";
import WishlistCard from "../components/WishlistCard";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WishlistPage({ onToast, refreshWishlist }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlistItems(res.data);
    } catch (err) {
      onToast("Failed to load wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
      onToast("Removed from wishlist", "info");
      refreshWishlist();
    } catch (err) {
      onToast("Failed to remove item", "error");
    }
  };

  const handleOrder = async (productId) => {
    try {
      await createOrder(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
      onToast("Order placed successfully! 🎉", "success");
      refreshWishlist();
    } catch (err) {
      onToast("Failed to place order", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
          <FiHeart className="text-2xl text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-dark">My Wishlist</h1>
          <p className="text-text-muted text-sm">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-5">
            <FiHeart className="text-4xl text-primary-light" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">Your wishlist is empty</h2>
          <p className="text-text-muted text-sm mb-6 text-center max-w-sm">
            Start adding products you love and come back to order them anytime!
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
          >
            <FiShoppingBag />
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.wishlist_id}
              item={item}
              onRemove={handleRemove}
              onOrder={handleOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
