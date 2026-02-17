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
      onToast("Gagal memuat wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
      onToast("Dihapus dari wishlist", "info");
      refreshWishlist();
    } catch (err) {
      onToast("Gagal menghapus item", "error");
    }
  };

  const handleOrder = async (productId) => {
    try {
      await createOrder(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
      onToast("Pesanan berhasil dibuat! 🎉", "success");
      refreshWishlist();
    } catch (err) {
      onToast("Gagal membuat pesanan", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Memuat wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/5 to-accent-soft rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-accent/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
            <FiHeart className="text-2xl text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Wishlist Saya</h1>
            <p className="text-text-muted text-sm mt-0.5">
              {wishlistItems.length} produk tersimpan
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mb-5 border-2 border-card-border">
            <FiHeart className="text-4xl text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">Wishlist kamu masih kosong</h2>
          <p className="text-text-muted text-sm mb-7 text-center max-w-sm leading-relaxed">
            Mulai tambahkan produk favoritmu dan pesan kapan saja!
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-light to-navy text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-navy/30 transition-all cursor-pointer"
          >
            <FiShoppingBag />
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
