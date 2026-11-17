import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">KarsaPOS</h1>
        <p className="text-gray-600 mb-6">Sistem Kasir & Manajemen Usaha</p>
        <Link href="/login" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
          Masuk ke Aplikasi
        </Link>
      </div>
    </div>
  );
}
