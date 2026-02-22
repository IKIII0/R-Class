import { useState, useEffect } from "react";
import { getProducts, addToWishlist, getWishlist, createOrder } from "../api";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiPackage } from "react-icons/fi";

export default function CatalogPage({ onToast, refreshWishlist }) {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, wishRes] = await Promise.all([
        getProducts(),
        getWishlist(),
      ]);
      setProducts(prodRes.data);
      setWishlistIds(new Set(wishRes.data.map((w) => w.product_id)));
    } catch (err) {
      onToast("Gagal memuat produk", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      setWishlistIds((prev) => new Set([...prev, productId]));
      onToast("Ditambahkan ke wishlist", "success");
      refreshWishlist();
    } catch (err) {
      if (err.response?.status === 409) {
        onToast("Sudah ada di wishlist", "info");
      } else {
        onToast("Gagal menambahkan ke wishlist", "error");
      }
    }
  };

  const handleOrder = async (productId) => {
    try {
      await createOrder(productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      onToast("Pesanan berhasil dibuat", "success");
      refreshWishlist();
    } catch (err) {
      onToast("Gagal membuat pesanan", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-navy via-navy-light to-slate rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-14 mb-8 sm:mb-10 overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary-light/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/6" />
        <div className="absolute bottom-4 right-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm mb-5 border border-white/10">
            <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-pulse" />
            Koleksi Terbaru Tersedia
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            Temukan Produk
            <br />
            Impianmu
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg leading-relaxed">
            Jelajahi koleksi produk teknologi & gaya hidup pilihan kami.
            Tambahkan ke wishlist atau pesan langsung.
          </p>

          {/* Search Bar */}
          <div className="mt-7 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-sm text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xl shadow-navy/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiPackage className="text-primary-dark text-base" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-dark">Semua Produk</h2>
            <p className="text-text-muted text-xs">
              {filteredProducts.length} produk tersedia
            </p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mb-5 border-2 border-card-border">
            <FiSearch className="text-3xl text-text-muted" />
          </div>
          <p className="text-text-dark font-semibold text-base">
            Produk tidak ditemukan
          </p>
          <p className="text-text-muted text-sm mt-1">
            Coba kata pencarian lain
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToWishlist={handleAddToWishlist}
              onOrder={handleOrder}
              isInWishlist={wishlistIds.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
