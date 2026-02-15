import { NavLink } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiClock, FiHome } from "react-icons/fi";

export default function Navbar({ wishlistCount }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white/25 text-white shadow-md"
        : "text-white/80 hover:bg-white/15 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-primary-dark via-primary to-primary-light shadow-lg shadow-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
              <FiShoppingBag className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Shop<span className="text-primary-50">Wish</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              <FiHome className="text-base" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink to="/wishlist" className={linkClass}>
              <div className="relative">
                <FiHeart className="text-base" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-accent text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Wishlist</span>
            </NavLink>

            <NavLink to="/transactions" className={linkClass}>
              <FiClock className="text-base" />
              <span className="hidden sm:inline">Transactions</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
