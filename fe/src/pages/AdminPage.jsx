import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiPackage, FiImage, FiDollarSign } from "react-icons/fi";

export default function AdminPage({ onToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      onToast("Gagal memuat produk", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", image_url: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      image_url: product.image_url || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      onToast("Nama dan harga harus diisi", "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = { ...form, price: parseFloat(form.price) };
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        onToast("Produk berhasil diupdate", "success");
      } else {
        await createProduct(data);
        onToast("Produk berhasil ditambahkan", "success");
      }
      resetForm();
      fetchProducts();
    } catch {
      onToast("Gagal menyimpan produk", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await deleteProduct(id);
      onToast("Produk berhasil dihapus", "success");
      fetchProducts();
    } catch {
      onToast("Gagal menghapus produk", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-slate rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiPackage className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-white/60 text-sm mt-0.5">
                {products.length} produk terdaftar
              </p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span className="hidden sm:inline">Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-surface rounded-2xl shadow-2xl border border-card-border w-full max-w-lg animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-card-border">
              <h2 className="text-lg font-bold text-text-dark">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-main hover:text-text-dark transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-text-body text-xs font-semibold mb-2 uppercase tracking-wider">Nama Produk</label>
                <div className="relative">
                  <FiPackage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Wireless Headphones"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-main border border-card-border text-text-dark text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-text-body text-xs font-semibold mb-2 uppercase tracking-wider">Harga (Rp)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Contoh: 349000"
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-main border border-card-border text-text-dark text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-text-body text-xs font-semibold mb-2 uppercase tracking-wider">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat produk..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-bg-main border border-card-border text-text-dark text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-text-body text-xs font-semibold mb-2 uppercase tracking-wider">URL Gambar</label>
                <div className="relative">
                  <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-main border border-card-border text-text-dark text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Preview */}
              {form.image_url && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-main border border-card-border">
                  <img src={form.image_url} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-card-border" />
                  <span className="text-xs text-text-muted">Preview gambar</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="text-base" />
                    {editingProduct ? "Update Produk" : "Simpan Produk"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mb-5 border-2 border-card-border">
            <FiPackage className="text-4xl text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-dark mb-2">Belum ada produk</h2>
          <p className="text-text-muted text-sm mb-7 text-center">
            Tambahkan produk pertama untuk mulai berjualan.
          </p>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <FiPlus /> Tambah Produk
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-surface rounded-2xl border border-card-border hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5">
                {/* Product Image */}
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 border border-card-border">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="text-2xl text-text-muted" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-dark text-sm sm:text-base truncate">{product.name}</h3>
                  <p className="text-text-muted text-xs mt-0.5 truncate">{product.description}</p>
                  <p className="text-navy font-bold text-sm sm:text-base mt-1">{formatPrice(product.price)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-9 h-9 rounded-xl bg-primary-100 text-primary-dark flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all cursor-pointer"
                    title="Hapus"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
