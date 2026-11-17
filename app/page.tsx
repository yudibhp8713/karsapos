import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="text-center p-10 max-w-lg">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">KarsaPOS</h1>
        <p className="text-lg text-gray-600 mb-8">Sistem Kasir & Manajemen Usaha Terpadu</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-xl font-medium text-gray-800 mb-2">Selamat Datang, Pengguna!</p>
          <p className="text-gray-500 mb-6">KarsaPOS sedang dalam persiapan. Segera hadir!</p>
          
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="block w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              🔐 Masuk ke Akun
            </Link>
            <Link 
              href="/dashboard" 
              className="block w-full border border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              📊 Lihat Dashboard Demo
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p>📦 Basic — Gratis untuk Pemula</p>
          <p>⚡ Pro — Fitur Lengkap untuk Bisnis Berkembang</p>
          <p>🏢 Enterprise — Solusi Terpusat untuk Perusahaan</p>
        </div>
      </div>
    </div>
  );
}
