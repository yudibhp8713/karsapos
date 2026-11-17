'use client';

import Link from 'next/link';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  LogIn,
  CheckCircle2 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-600">KarsaPOS</h1>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-teal-600 flex items-center gap-2">
              <LogIn size={18} /> Masuk
            </Link>
            <Link 
              href="/register" 
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Sistem Kasir Modern & Terintegrasi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Kelola penjualan, stok barang, dan laporan bisnis Anda dari satu tempat. 
            Cepat, mudah, dan siap mendukung pertumbuhan usaha Anda.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/register" 
              className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-teal-700 transition shadow-lg"
            >
              Mulai Gratis Sekarang
            </Link>
            <Link 
              href="#pricing" 
              className="border border-teal-600 text-teal-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-teal-50 transition"
            >
              Lihat Paket & Harga
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Mengapa Memilih KarsaPOS?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShoppingCart className="text-teal-600" size={32} />, title: 'Transaksi Cepat', desc: 'Proses penjualan dalam hitungan detik' },
              { icon: <Package className="text-teal-600" size={32} />, title: 'Kelola Stok', desc: 'Pantau barang masuk dan keluar otomatis' },
              { icon: <BarChart3 className="text-teal-600" size={32} />, title: 'Laporan Lengkap', desc: 'Ketahui kinerja bisnis Anda kapan saja' },
              { icon: <Users className="text-teal-600" size={32} />, title: 'Data Pelanggan', desc: 'Bangun hubungan dengan pelanggan Anda' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paket Harga */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Pilih Paket yang Sesuai</h3>
          <p className="text-center text-gray-500 mb-12">Mulai dari yang kecil, tingkatkan saat bisnis Anda berkembang</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h4 className="text-xl font-bold text-gray-700 mb-2">Basic</h4>
              <p className="text-3xl font-bold text-gray-800 mb-4">Rp 49.000<span className="text-sm font-normal text-gray-500">/bln</span></p>
              <ul className="space-y-3 mb-8">
                {['Transaksi penjualan', 'Kelola produk', 'Laporan dasar', '2 pengguna kasir'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center border border-teal-600 text-teal-600 py-2 rounded-lg hover:bg-teal-50">
                Pilih Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-teal-500 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-sm px-3 py-1 rounded-full">Populer</span>
              <h4 className="text-xl font-bold text-teal-700 mb-2">Pro</h4>
              <p className="text-3xl font-bold text-gray-800 mb-4">Rp 99.000<span className="text-sm font-normal text-gray-500">/bln</span></p>
              <ul className="space-y-3 mb-8">
                {['Semua fitur Basic', 'Laporan lanjutan', 'Stok kontrol lengkap', 'Poin pelanggan', '10 pengguna'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={16} className="text-teal-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
                Pilih Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h4 className="text-xl font-bold text-gray-700 mb-2">Enterprise</h4>
              <p className="text-3xl font-bold text-gray-800 mb-4">Rp 299.000<span className="text-sm font-normal text-gray-500">/cabang/bln</span></p>
              <ul className="space-y-3 mb-8">
                {['Semua fitur Pro', 'Multi-cabang', 'API akses', 'Integrasi marketplace', 'Pengguna tak terbatas'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center border border-teal-600 text-teal-600 py-2 rounded-lg hover:bg-teal-50">
                Pilih Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">KarsaPOS</h3>
          <p className="text-gray-400 mb-6">Sistem Kasir Modern & Terintegrasi</p>
          <p className="text-sm text-gray-500">© 2026 KarsaPOS. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
