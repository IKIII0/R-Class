import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import CatalogPage from "./pages/CatalogPage";
import WishlistPage from "./pages/WishlistPage";
import TransactionPage from "./pages/TransactionPage";
import { getWishlistCount } from "./api";

function App() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await getWishlistCount();
      setWishlistCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch wishlist count");
    }
  }, []);

  useEffect(() => {
    fetchWishlistCount();
  }, [fetchWishlistCount]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-main">
        <Navbar wishlistCount={wishlistCount} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <CatalogPage
                  onToast={addToast}
                  refreshWishlist={fetchWishlistCount}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  onToast={addToast}
                  refreshWishlist={fetchWishlistCount}
                />
              }
            />
            <Route
              path="/transactions"
              element={<TransactionPage onToast={addToast} />}
            />
          </Routes>
        </main>

        {/* Toast Container */}
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-card-border bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-text-muted text-sm">
              © 2026 <span className="font-semibold text-primary">ShopWish</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
