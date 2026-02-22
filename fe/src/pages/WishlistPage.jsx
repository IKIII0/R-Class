import { useState, useEffect } from "react";
import {
  getWishlist,
  removeFromWishlist,
  createOrder,
  getProducts,
} from "../api";
import WishlistCard from "../components/WishlistCard";
import OrderModal from "../components/OrderModal";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WishlistPage({ onToast, refreshWishlist }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProduct, setOrderProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wishRes, prodRes] = await Promise.all([
        getWishlist(),
        getProducts(),
      ]);
      setWishlistItems(wishRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      onToast("Gagal memuat wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
      onToast("Dihapus dari wishlist", "success");
      refreshWishlist();
    } catch (err) {
      onToast("Gagal menghapus dari wishlist", "error");
    }
  };

  const handleOpenOrder = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) setOrderProduct(product);
  };

  const handleConfirmOrder = async (productId, quantity, paymentMethod) => {
    try {
      await createOrder(productId, quantity, paymentMethod);
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
      onToast("Pesanan berhasil dibuat", "success");
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
      <div className="bg-gradient-to-r from-navy via-navy-light to-slate rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FiHeart className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Wishlist Kamu</h1>
            <p className="text-white/60 text-sm mt-0.5">
              {wishlistItems.length} item tersimpan
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mb-5 border-2 border-card-border">
            <FiHeart className="text-4xl text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">
            Wishlist kosong
          </h2>
          <p className="text-text-muted text-sm mb-7 text-center max-w-sm leading-relaxed">
            Belum ada produk yang disimpan di wishlist kamu. Jelajahi katalog
            untuk menemukan produk favoritmu.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-light to-navy text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-navy/30 transition-all cursor-pointer"
          >
            <FiShoppingBag />
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.product_id}
              item={item}
              onRemove={handleRemove}
              onOrder={handleOpenOrder}
            />
          ))}
        </div>
      )}

      {/* Order Modal */}
      {orderProduct && (
        <OrderModal
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}
