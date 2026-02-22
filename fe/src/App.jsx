import "./index.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import ParticleBackground from "./components/ParticleBackground";
import SplashScreen from "./components/SplashScreen";
import CatalogPage from "./pages/CatalogPage";
import WishlistPage from "./pages/WishlistPage";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import { getWishlistCount } from "./api";
import { FiShoppingBag } from "react-icons/fi";

function AppLayout() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuth();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await getWishlistCount();
      setWishlistCount(res.data.count);
    } catch (err) {
      // User may not be logged in yet
    }
  }, []);

  useEffect(() => {
    if (!isAuthPage && !isAdmin) {
      fetchWishlistCount();
    }
  }, [fetchWishlistCount, isAuthPage, isAdmin]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth pages: no Navbar, no Footer, no ParticleBackground (pages have their own)
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg-main flex flex-col relative">
        <ParticleBackground />
        <Navbar wishlistCount={wishlistCount} />

        <main className="flex-1 relative z-10">
          <Routes>
            {isAdmin ? (
              /* Admin: only admin panel, redirect everything else to /admin */
              <>
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage onToast={addToast} />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            ) : (
              /* Regular user: catalog, wishlist, transactions */
              <>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <CatalogPage
                        onToast={addToast}
                        refreshWishlist={fetchWishlistCount}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage
                        onToast={addToast}
                        refreshWishlist={fetchWishlistCount}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionPage onToast={addToast} />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>

        {/* Toast Container */}
        <div className="fixed top-20 right-5 z-[100] flex flex-col gap-2.5">
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
        <footer className="bg-navy text-white relative z-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <FiShoppingBag className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Shop<span className="text-primary-light">Wish</span>
                  </span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  Destinasi belanja produk teknologi & gaya hidup premium. Jelajahi, simpan ke wishlist, dan pesan dengan mudah.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-sm text-white/90 mb-4">Tautan Cepat</h4>
                <ul className="flex flex-col gap-2.5">
                  <li><a href="/" className="text-white/50 hover:text-primary-light text-sm transition-colors">Home</a></li>
                  <li><a href="/wishlist" className="text-white/50 hover:text-primary-light text-sm transition-colors">Wishlist</a></li>
                  <li><a href="/transactions" className="text-white/50 hover:text-primary-light text-sm transition-colors">Transactions</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-sm text-white/90 mb-4">Dukungan</h4>
                <ul className="flex flex-col gap-2.5">
                  <li><span className="text-white/50 text-sm">Pusat Bantuan</span></li>
                  <li><span className="text-white/50 text-sm">Kebijakan Privasi</span></li>
                  <li><span className="text-white/50 text-sm">Syarat & Ketentuan</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/40 text-xs">
                © 2026 ShopWish. Hak cipta dilindungi.
              </p>
              <div className="flex items-center gap-5">
                <a href="#" className="text-white/40 hover:text-primary-light transition-colors text-xs">Instagram</a>
                <a href="#" className="text-white/40 hover:text-primary-light transition-colors text-xs">Twitter</a>
                <a href="#" className="text-white/40 hover:text-primary-light transition-colors text-xs">Email</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
