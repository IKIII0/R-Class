import { useState, useEffect } from "react";
import { getOrders } from "../api";
import { FiClock, FiPackage, FiShoppingBag, FiHash, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TransactionPage({ onToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      onToast("Gagal memuat transaksi", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-slate rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FiClock className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>
            <p className="text-white/60 text-sm mt-0.5">
              {orders.length} pesanan telah dibuat
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mb-5 border-2 border-card-border">
            <FiPackage className="text-4xl text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">Belum ada transaksi</h2>
          <p className="text-text-muted text-sm mb-7 text-center max-w-sm leading-relaxed">
            Riwayat pesananmu akan muncul di sini setelah kamu membuat pesanan pertama.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-light to-navy text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-navy/30 transition-all cursor-pointer"
          >
            <FiShoppingBag />
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-surface rounded-2xl border border-card-border hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5">
                {/* Product Image */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 border border-card-border">
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-dark text-sm sm:text-base truncate">
                    {order.product_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-text-muted">
                      <FiHash className="text-primary text-[11px]" />
                      <span className="font-medium text-text-body">#{order.id}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-text-muted">
                      <FiCalendar className="text-primary text-[11px]" />
                      {formatDate(order.order_date)}
                    </span>
                  </div>
                </div>

                {/* Price & Status */}
                <div className="text-right flex-shrink-0">
                  <p className="text-navy font-bold text-sm sm:text-lg">
                    {formatPrice(order.product_price)}
                  </p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-success-soft text-success text-[10px] font-semibold rounded-full border border-success/15">
                    Selesai
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Summary */}
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-5 sm:p-6 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">Total Belanja</span>
              <span className="text-xl sm:text-2xl font-bold text-white">
                {formatPrice(orders.reduce((sum, o) => sum + parseFloat(o.product_price), 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
