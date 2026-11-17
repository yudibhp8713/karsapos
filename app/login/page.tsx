'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('karsapos_user', JSON.stringify({
      name: 'Pengguna',
      email: email
    }));
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>KarsaPOS</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '0.5rem', margin: '0.5rem' }}
        />
        <br />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Masuk
        </button>
      </form>
    </div>
  );
}
