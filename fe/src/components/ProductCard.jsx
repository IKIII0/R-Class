import { useState } from "react";
import { FiHeart, FiShoppingCart, FiCheck } from "react-icons/fi";

export default function ProductCard({ product, onAddToWishlist, onOrder, isInWishlist }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlistAdding, setWishlistAdding] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleWishlist = async () => {
    setWishlistAdding(true);
    await onAddToWishlist(product.id);
    setTimeout(() => setWishlistAdding(false), 600);
  };

  const handleOrder = async () => {
    setOrdering(true);
    await onOrder(product.id);
    setTimeout(() => setOrdering(false), 600);
  };

  return (
    <div className="group bg-surface rounded-2xl border border-card-border hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 overflow-hidden hover:-translate-y-1.5 animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-bg-main">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-shimmer rounded-none" />
        )}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist badge on image corner */}
        {isInWishlist && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
            <FiHeart className="text-white text-xs fill-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2">
        <h3 className="font-semibold text-text-dark text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2 min-h-0 sm:min-h-[2rem]">
          {product.description}
        </p>
        <p className="text-navy font-bold text-base sm:text-lg mt-1 break-all">
          {formatPrice(product.price)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col min-[480px]:flex-row gap-1.5 sm:gap-2 mt-2">
          <button
            onClick={handleWishlist}
            disabled={isInWishlist || wishlistAdding}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isInWishlist
                ? "bg-accent-soft text-accent border border-accent/20"
                : "bg-bg-main text-navy-medium hover:bg-primary-100 hover:text-primary-dark border border-card-border hover:border-primary/30"
            }`}
          >
            {isInWishlist ? (
              <>
                <FiCheck className="text-sm" /> Wishlisted
              </>
            ) : (
              <>
                <FiHeart className="text-sm" /> Wishlist
              </>
            )}
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
