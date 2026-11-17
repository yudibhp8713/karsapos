'use client';

import { useRouter } from 'next/navigation';

export function useRole(allowedRoles: string[]) {
  // Baca user dari localStorage (sementara)
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('karsapos_user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const router = useRouter();

  if (!user || !allowedRoles.includes(user.role)) {
    return { authorized: false, user, redirect: () => router.push('/dashboard') };
  }
  return { authorized: true, user };
}
