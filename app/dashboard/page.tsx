'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const user = useState<any>(null)[0];

  useEffect(() => {
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return <div>Memuat...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Selamat Datang, {user.name}!</h1>
      <p>KarsaPOS sedang dalam persiapan.</p>
    </div>
  );
}
