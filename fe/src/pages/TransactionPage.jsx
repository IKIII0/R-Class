import { useState, useEffect } from "react";
import { getOrders } from "../api";
import { FiClock, FiPackage, FiShoppingBag, FiHash, FiCalendar, FiDollarSign } from "react-icons/fi";
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
      onToast("Failed to load transactions", "error");
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
          <p className="text-text-muted font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
          <FiClock className="text-2xl text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Transaction History</h1>
          <p className="text-text-muted text-sm">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-5">
            <FiPackage className="text-4xl text-primary-light" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">No transactions yet</h2>
          <p className="text-text-muted text-sm mb-6 text-center max-w-sm">
            Your order history will appear here once you place your first order.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
          >
            <FiShoppingBag />
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 p-4 sm:p-5">
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
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
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <FiHash className="text-primary" />
                      Order #{order.id}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <FiCalendar className="text-primary" />
                      {formatDate(order.order_date)}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-primary-dark font-bold text-base sm:text-lg">
                    {formatPrice(order.product_price)}
                  </div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-success/10 text-success text-[10px] font-semibold rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Summary */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary rounded-2xl border border-primary-100 p-5 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-primary text-lg" />
                <span className="text-sm font-medium text-text-dark">Total Spent</span>
              </div>
              <span className="text-xl font-bold text-primary-dark">
                {formatPrice(orders.reduce((sum, o) => sum + parseFloat(o.product_price), 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
