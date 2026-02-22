import { useState } from "react";
import { FiX, FiMinus, FiPlus, FiCreditCard, FiSmartphone, FiTruck } from "react-icons/fi";

const PAYMENT_METHODS = [
  { id: "transfer_bank", label: "Transfer Bank", icon: FiCreditCard, desc: "BCA, BNI, Mandiri, BRI" },
  { id: "e_wallet", label: "E-Wallet", icon: FiSmartphone, desc: "GoPay, OVO, Dana, ShopeePay" },
  { id: "cod", label: "Cash on Delivery", icon: FiTruck, desc: "Bayar saat barang sampai" },
];

export default function OrderModal({ product, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("transfer_bank");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const totalPrice = parseFloat(product.price) * quantity;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onConfirm(product.id, quantity, paymentMethod);
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface rounded-2xl shadow-2xl border border-card-border w-full max-w-lg animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-card-border">
          <h2 className="text-lg font-bold text-text-dark">Konfirmasi Pesanan</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-main hover:text-text-dark transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 border border-card-border">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-dark text-sm truncate">{product.name}</h3>
              <p className="text-navy font-bold text-lg mt-1">{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-text-body text-xs font-semibold mb-3 uppercase tracking-wider">Jumlah</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl bg-bg-main border border-card-border flex items-center justify-center text-text-body hover:bg-primary-100 hover:text-primary-dark hover:border-primary/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiMinus />
              </button>
              <span className="w-16 h-10 rounded-xl bg-bg-main border border-card-border flex items-center justify-center text-text-dark font-bold text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-bg-main border border-card-border flex items-center justify-center text-text-body hover:bg-primary-100 hover:text-primary-dark hover:border-primary/30 transition-all cursor-pointer"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-text-body text-xs font-semibold mb-3 uppercase tracking-wider">Metode Pembayaran</label>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-primary-100 border-primary/30 shadow-sm"
                        : "bg-bg-main border-card-border hover:border-primary/20"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-primary text-white" : "bg-surface text-text-muted border border-card-border"
                    }`}>
                      <Icon className="text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? "text-primary-dark" : "text-text-dark"}`}>
                        {method.label}
                      </p>
                      <p className="text-[11px] text-text-muted">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isActive ? "border-primary" : "border-card-border"
                    }`}>
                      {isActive && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Total Pembayaran</p>
              <p className="text-white font-bold text-xl mt-0.5">{formatPrice(totalPrice)}</p>
            </div>
            <span className="text-white/40 text-xs">{quantity} item</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-card-border">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiCreditCard className="text-base" />
                Bayar Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
