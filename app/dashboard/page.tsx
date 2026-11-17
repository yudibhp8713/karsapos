'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return <div className="p-8">Memuat...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Selamat Datang di KarsaPOS</h1>
      <p className="mt-2">Halo, {user.name}! 🎉</p>
      <p className="mt-1 text-gray-500">Aplikasi sedang disiapkan. Fitur akan segera tersedia.</p>
    </div>
  );
}
Commit pesan: `Buat dashboard sederhana`
