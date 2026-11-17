'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Store
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Beranda', href: '/dashboard' },
  { icon: <Package size={20} />, label: 'Produk', href: '/dashboard/products' },
  { icon: <ShoppingCart size={20} />, label: 'Kasir', href: '/dashboard/pos' },
  { icon: <BarChart3 size={20} />, label: 'Laporan', href: '/dashboard/reports' },
  { icon: <Users size={20} />, label: 'Pelanggan', href: '/dashboard/customers' },
  { icon: <Settings size={20} />, label: 'Pengaturan', href: '/dashboard/settings' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ambil data user dari localStorage (sementara)
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('karsapos_user');
    document.cookie = 'karsapos_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  if (!user) return <div className="p-8">Memuat...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-teal-600">KarsaPOS</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Store size={14} />
            <span>{user.businessName}</span>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
            {user.plan}
          </span>
        </div>

        <nav className="p-3">
          {menuItems.map((item, i) => (
            <Link 
              key={i} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 mb-0.5 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 w-64 px-3">
          <button>
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition"
          >
            <LogOut size={20} />
            <span>Keluar</span>
           </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6">
        {/* Header Atas */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {user.name} 👋</h2>
            <p className="text-gray-500">Berikut ringkasan bisnis Anda hari ini</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </header>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-1">Penjualan Hari Ini</p>
            <p className="text-2xl font-bold text-gray-800">Rp 0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-1">Total Produk</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-1">Transaksi Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 mb-1">Pelanggan</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>
        </div>

        {/* Cepat Mulai */}
        <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-800 mb-4">🚀 Langkah Pertama</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/products" className="p-4 bg-white rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-800">1. Tambah Produk</h4>
              <p className="text-sm text-gray-500">Masukkan barang dagangan Anda</p>
            </Link>
            <Link href="/dashboard/pos" className="p-4 bg-white rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-800">2. Buka Kasir</h4>
              <p className="text-sm text-gray-500">Mulai proses penjualan</p>
            </Link>
            <Link href="/dashboard/reports" className="p-4 bg-white rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-800">3. Lihat Laporan</h4>
              <p className="text-sm text-gray-500">Pantau kinerja bisnis Anda</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
