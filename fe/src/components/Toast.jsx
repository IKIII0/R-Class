import { useState, useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export default function Toast({ message, type = "success", onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const configs = {
    success: { icon: <FiCheckCircle className="text-lg text-success" />, border: "border-l-success", bg: "bg-success-soft" },
    error: { icon: <FiAlertCircle className="text-lg text-accent" />, border: "border-l-accent", bg: "bg-accent-soft" },
    info: { icon: <FiInfo className="text-lg text-primary" />, border: "border-l-primary", bg: "bg-primary-50" },
  };

  const config = configs[type];

  return (
    <div
      className={`flex items-center gap-3 bg-surface rounded-xl shadow-2xl shadow-navy/15 px-4 py-3.5 border-l-4 ${config.border} min-w-[300px] max-w-[400px] ${exiting ? "animate-slide-out" : "animate-slide-in"}`}
    >
      <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {config.icon}
      </div>
      <p className="flex-1 text-sm text-text-dark font-medium leading-snug">{message}</p>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-text-muted hover:text-text-dark transition-colors cursor-pointer flex-shrink-0"
      >
        <FiX className="text-base" />
      </button>
    </div>
  );
}
