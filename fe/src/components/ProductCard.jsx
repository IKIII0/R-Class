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
    <div className="group bg-white rounded-2xl border border-card-border shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary animate-pulse" />
        )}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5">
        <h3 className="font-semibold text-text-dark text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <p className="text-primary-dark font-bold text-lg">
          {formatPrice(product.price)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleWishlist}
            disabled={isInWishlist || wishlistAdding}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isInWishlist
                ? "bg-accent/10 text-accent border border-accent/30"
                : "bg-secondary text-primary hover:bg-primary-100 border border-card-border hover:border-primary-light"
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
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 cursor-pointer"
          >
            <FiShoppingCart className="text-sm" />
            {ordering ? "Ordering..." : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
