'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  category?: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Kelola Produk</h2>
        <button 
          onClick={() => router.push('/dashboard/products/new')}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          <Plus size={18} /> Produk Baru
        </button>
      </div>

      {/* Pencarian */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk atau kode batang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nama Produk</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kode</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Harga Beli</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Harga Jual</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Stok</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  Belum ada produk. Klik <strong>"Produk Baru"</strong> untuk menambahkan.
                </td>
              </tr>
            ) : (
              filtered.map(product => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.barcode || '-'}</td>
                  <td className="px-4 py-3">Rp {product.purchasePrice.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 font-medium">Rp {product.sellingPrice.toLocaleString('id-ID')}</td>
                  <td className={`px-4 py-3 ${product.stock <= product.minStock ? 'text-red-600 font-medium' : ''}`}>
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-teal-600 hover:text-teal-800 mr-2">
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
