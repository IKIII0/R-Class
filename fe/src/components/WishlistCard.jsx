import { useState } from "react";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";

export default function WishlistCard({ item, onRemove, onOrder }) {
  const [removing, setRemoving] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.product_id);
  };

  const handleOrder = async () => {
    setOrdering(true);
    await onOrder(item.product_id);
  };

  return (
    <div className={`group bg-surface rounded-2xl border border-card-border hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 overflow-hidden animate-fade-in ${removing ? "opacity-40 scale-95 pointer-events-none" : ""}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-bg-main">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Remove button overlay */}
        <button
          onClick={handleRemove}
          disabled={removing}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2">
        <h3 className="font-semibold text-text-dark text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {item.name}
        </h3>
        <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2 min-h-0 sm:min-h-[2rem]">
          {item.description}
        </p>
        <p className="text-navy font-bold text-base sm:text-lg mt-1 break-all">
          {formatPrice(item.price)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col min-[480px]:flex-row gap-1.5 sm:gap-2 mt-2">
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-accent bg-accent-soft border border-accent/20 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 cursor-pointer"
          >
            <FiTrash2 className="text-sm" />
            Remove
          </button>

          <button
            onClick={handleOrder}
            disabled={ordering}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-navy-light to-navy shadow-md hover:shadow-lg hover:shadow-navy/30 hover:from-navy hover:to-navy transition-all duration-200 cursor-pointer"
          >
            <FiShoppingCart className="text-sm" />
            {ordering ? "Ordering..." : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
