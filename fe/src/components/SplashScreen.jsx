import { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit

  useEffect(() => {
    // enter animation plays via CSS
    const holdTimer = setTimeout(() => setPhase("exit"), 1800);
    const exitTimer = setTimeout(() => onFinish(), 2600);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-navy transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow circles */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-primary-light/8 rounded-full blur-[80px] translate-x-20 -translate-y-10 animate-pulse" style={{ animationDelay: "0.5s" }} />

      {/* Content */}
      <div className={`relative flex flex-col items-center gap-6 splash-content ${phase === "enter" ? "splash-enter" : ""}`}>
        {/* Logo icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 splash-icon">
            <FiShoppingBag className="text-white text-4xl" />
          </div>
          {/* Ring pulse */}
          <div className="absolute inset-0 w-20 h-20 border-2 border-primary/30 rounded-2xl animate-ping" style={{ animationDuration: "1.5s" }} />
        </div>

        {/* Brand text */}
        <div className="flex items-center gap-0.5">
          <span className="text-4xl font-bold text-white tracking-tight splash-text-left">Shop</span>
          <span className="text-4xl font-bold text-primary-light tracking-tight splash-text-right">Wish</span>
        </div>

        {/* Tagline */}
        <p className="text-white/40 text-sm font-medium tracking-widest uppercase splash-tagline">
          Premium Shopping Experience
        </p>

        {/* Loading bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full splash-loader" />
        </div>
      </div>
    </div>
  );
}
