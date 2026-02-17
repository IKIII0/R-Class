import { NavLink } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiClock, FiHome } from "react-icons/fi";

export default function Navbar({ wishlistCount }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/30"
        : "text-text-light hover:bg-navy-medium hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-white/5">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
              <FiShoppingBag className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Shop<span className="text-primary-light">Wish</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-1.5">
            <NavLink to="/" end className={linkClass}>
              <FiHome className="text-base" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            <NavLink to="/wishlist" className={linkClass}>
              <div className="relative">
                <FiHeart className="text-base" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md shadow-accent/40 px-1">
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
