'use client';

import { useRole } from '@/lib/auth/useRole';

export default function ReportsPage() {
  const { authorized, user } = useRole(['pemilik', 'manajer']);
  if (!authorized) {
    return <div className="p-12 text-center text-red-500">Anda tidak memiliki akses ke halaman ini.</div>;
  }
  // ... sisa kode halaman
}
