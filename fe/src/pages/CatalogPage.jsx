import { useState, useEffect } from "react";
import { getProducts, addToWishlist, getWishlist, createOrder } from "../api";
import ProductCard from "../components/ProductCard";
import { FiShoppingBag, FiSearch } from "react-icons/fi";

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
      const [prodRes, wishRes] = await Promise.all([getProducts(), getWishlist()]);
      setProducts(prodRes.data);
      setWishlistIds(new Set(wishRes.data.map((w) => w.product_id)));
    } catch (err) {
      onToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      setWishlistIds((prev) => new Set([...prev, productId]));
      onToast("Added to wishlist! 💙", "success");
      refreshWishlist();
    } catch (err) {
      if (err.response?.status === 409) {
        onToast("Already in wishlist", "info");
      } else {
        onToast("Failed to add to wishlist", "error");
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
      onToast("Order placed successfully! 🎉", "success");
      refreshWishlist();
    } catch (err) {
      onToast("Failed to place order", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-blue-400 rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              ✨ New Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Discover Amazing Products
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl">
            Browse our curated collection of premium tech & lifestyle products. Add to your wishlist or order instantly.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm text-sm text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-text-dark">
          All Products{" "}
          <span className="text-text-muted font-normal text-sm">
            ({filteredProducts.length} items)
          </span>
        </h2>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-3xl text-primary-light" />
          </div>
          <p className="text-text-muted font-medium">No products found</p>
          <p className="text-text-muted text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
