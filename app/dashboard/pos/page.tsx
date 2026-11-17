'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2, X, DollarSign, ShoppingCart } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function POSPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [received, setReceived] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    loadProducts(u.businessId);
  }, [router]);

  const loadProducts = async (businessId: string) => {
    try {
      const res = await fetch(`/api/products?businessId=${businessId}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  );

  const addToCart = (product: any) => {
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      setCart(cart.map(i =>
        i.productId === product.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
          : i
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.sellingPrice,
        quantity: 1,
        subtotal: product.sellingPrice
      }]);
    }
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.productId === productId) {
        const q = Math.max(0, i.quantity + delta);
        return q === 0 ? null : { ...i, quantity: q, subtotal: q * i.price };
      }
      return i;
    }).filter(Boolean) as CartItem[]);
  };

  const removeItem = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId));
  };

  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const change = parseFloat(received) - total;

  const handleCheckout = async () => {
    if (!received || parseFloat(received) < total) {
      alert('Uang yang diterima kurang!'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: user.businessId,
          userId: user.id,
          items: cart,
          totalAmount: total,
          paymentMethod,
          received: parseFloat(received),
          change
        })
      });
      if (!res.ok) throw new Error('Transaksi gagal');
      alert('✅ Transaksi Berhasil! Terima kasih!');
      setCart([]);
      setReceived('');
      setShowPayment(false);
      loadProducts(user.businessId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Memuat...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Daftar Produk */}
      <div className="flex-1 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">🛒 Kasir — Pilih Barang</h2>
        <input
          type="text"
          placeholder="Cari produk / scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-teal-500 outline-none"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="p-3 bg-white border rounded-xl hover:bg-teal-50 hover:border-teal-300 transition text-left"
            >
              <p className="font-medium text-sm truncate">{p.name}</p>
              <p className="text-xs text-gray-500">Stok: {p.stock}</p>
              <p className="text-teal-600 font-bold mt-1">Rp {p.sellingPrice.toLocaleString('id-ID')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Keranjang */}
      <div className="w-96 bg-gray-50 p-4 flex flex-col">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <ShoppingCart size={20} /> Keranjang
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada barang</p>
          ) : cart.map(item => (
            <div key={item.productId} className="bg-white p-3 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, -1)} className="p-1 border rounded">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="p-1 border rounded">
                    <Plus size={12} />
                  </button>
                </div>
                <p className="font-bold text-sm">Rp {item.subtotal.toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Bayar */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span className="text-teal-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          {!showPayment ? (
            <button
              onClick={() => cart.length > 0 && setShowPayment(true)}
              disabled={cart.length === 0}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-40"
            >
              Proses Pembayaran
            </button>
          ) : (
            <div className="space-y-3">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="CASH">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="TRANSFER">Transfer Bank</option>
                <option value="EWALLET">E-Wallet</option>
              </select>
              
              <input
                type="number"
                placeholder="Uang Diterima"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                className="w-full p-2 border rounded-lg text-lg"
              />
              
              {parseFloat(received) >= total && total > 0 && (
                <p className="text-right text-green-600 font-medium">
                  Kembali: Rp {change.toLocaleString('id-ID')}
                </p>
              )}
              
              <div className="flex gap-2">
                <button onClick={() => setShowPayment(false)} className="flex-1 py-2 border rounded-lg">
                  Kembali
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || parseFloat(received) < total}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-40"
                >
                  {loading ? 'Memproses...' : 'Selesai'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
