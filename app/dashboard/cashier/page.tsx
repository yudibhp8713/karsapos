'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, DollarSign, User } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_products');
    if (saved) setProducts(JSON.parse(saved));
    const savedCust = localStorage.getItem('karsapos_customers');
    if (savedCust) setCustomers(JSON.parse(savedCust));
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, subtotal: product.price }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null as any;
        if (newQty > item.stock) return item;
        return { ...item, quantity: newQty, subtotal: newQty * item.price };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const invoiceNo = 'INV-' + Date.now();
    const sale = {
      invoiceNo,
      items: cart,
      total,
      customer: selectedCustomer,
      date: new Date().toISOString()
    };
    
    const sales = JSON.parse(localStorage.getItem('karsapos_sales') || '[]');
    sales.unshift(sale);
    localStorage.setItem('karsapos_sales', JSON.stringify(sales));
    
    alert(`✅ Transaksi Berhasil!\nFaktur: ${invoiceNo}\nTotal: Rp ${total.toLocaleString('id-ID')}`);
    
    setCart([]);
    setSelectedCustomer(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <DollarSign size={24} className="text-teal-600" /> Halaman Kasir
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produk */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari produk untuk ditambahkan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py
          className="text-center py-12 text-gray-500">
              Belum ada produk. Tambahkan produk dulu di menu Produk.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white p-4 rounded-lg shadow border hover:border-teal-500 hover:shadow-md transition text-left"
                >
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">Stok: {p.stock}</p>
                  <p className="text-teal-600 font-bold mt-1">Rp {p.price.toLocaleString('id-ID')}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keranjang */}
        <div className="bg-white rounded-lg shadow p-4 h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart size={20} className="text-teal-600" /> Keranjang
            </h2>
            <span className="bg-teal-100 text-teal-700 text-sm px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>

          {/* Pelanggan */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User size={14} /> Pelanggan
              </span>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="text-sm text-teal-600 hover:underline"
              >
                {selectedCustomer ? 'Ganti' : 'Pilih'}
              </button>
            </div>
            <p className="text-sm mt-1">
              {selectedCustomer ? selectedCustomer.name : 'Umum'}
            </p>
          </div>

          {/* Daftar Item */}
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Klik produk untuk menambahkan
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total & Bayar */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span className="text-teal-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Proses Pembayaran
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih Pelanggan */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Pilih Pelanggan</h3>
              <button onClick={() => setShowCustomerModal(false)}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
              >
                Pelanggan Umum
              </button>
              {customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowCustomerModal(false);
                  }}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.phone || '-'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
