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

  const icons = {
    success: <FiCheckCircle className="text-lg text-success" />,
    error: <FiAlertCircle className="text-lg text-accent" />,
    info: <FiInfo className="text-lg text-primary" />,
  };

  const borderColors = {
    success: "border-l-success",
    error: "border-l-accent",
    info: "border-l-primary",
  };

  return (
    <div
      className={`flex items-center gap-3 bg-white rounded-xl shadow-xl shadow-black/10 px-4 py-3 border-l-4 ${borderColors[type]} min-w-[280px] max-w-[380px] ${exiting ? "animate-slide-out" : "animate-slide-in"}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-text-dark font-medium">{message}</p>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-text-muted hover:text-text-dark transition-colors cursor-pointer"
      >
        <FiX className="text-base" />
      </button>
    </div>
  );
}
