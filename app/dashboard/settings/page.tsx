'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CreditCard, User, Store, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('plan');

  useEffect(() => {
    const stored = localStorage.getItem('karsapos_user');
    if (!stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return <div className="p-6">Memuat...</div>;

  const plans = [
    { id: 'BASIC', name: 'Basic', price: 'Rp 49.000/month', features: ['Transaksi dasar', 'Kelola produk', 'Laporan dasar', '2 pengguna'] },
    { id: 'PRO', name: 'Pro', price: 'Rp 99.000/month', features: ['Semua fitur Basic', 'Laporan lengkap', 'Stok kontrol', 'Pelanggan & poin', '10 pengguna'] },
    { id: 'ENTERPRISE', name: 'Enterprise', price: 'Rp 299.000/cabang', features: ['Semua fitur Pro', 'Multi-cabang', 'API akses', 'Dukungan prioritas', 'Pengguna tak terbatas'] }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan</h2>
      
      {/* Tab */}
      <div className="flex gap-4 mb-6 border-b">
        {[
          { id: 'plan', label: 'Langganan', icon: <CreditCard size={16} /> },
          { id: 'business', label: 'Profil Toko', icon: <Store size={16} /> },
          { id: 'account', label: 'Akun', icon: <User size={16} /> },
          { id: 'notifications', label: 'Notifikasi', icon: <Bell size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition ${
              activeTab === tab.id ? 'border-teal-600 text-teal-600 font-medium' : 'border-transparent text-gray-500'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Konten Tab: Langganan */}
      {activeTab === 'plan' && (
        <div>
          <div className="bg-teal-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-teal-700">Paket Aktif Saat Ini</p>
            <p className="text-xl font-bold text-teal-800">{user.plan}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className={`p-6 rounded-xl border ${user.plan === plan.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {user.plan === plan.id ? (
                  <span className="block text-center py-2 bg-teal-600 text-white rounded-lg text-sm">Paket Saat Ini</span>
                ) : (
                  <button className="w-full py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm">
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'business' && (
        <div className="max-w-lg bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Informasi Toko</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
              <input type="text" defaultValue={user.businessName} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Alamat lengkap toko"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
              <input type="tel" className="w-full px-3 py-2 border rounded-lg" placeholder="08xx-xxxx-xxxx" />
            </div>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Simpan Perubahan</button>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="max-w-lg bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Profil Akun</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input type="text" defaultValue={user.name} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue={user.email} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Perbarui Profil</button>
            <hr className="my-4" />
            <h4 className="font-medium text-sm">Ubah Kata Sandi</h4>
            <div className="space-y-3">
              <input type="password" placeholder="Kata sandi lama" className="w-full px-3 py-2 border rounded-lg" />
              <input type="password" placeholder="Kata sandi baru" className="w-full px-3 py-2 border rounded-lg" />
              <input type="password" placeholder="Konfirmasi kata sandi baru" className="w-full px-3 py-2 border rounded-lg" />
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">Ubah Kata Sandi</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-lg bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Preferensi Notifikasi</h3>
          <div className="space-y-4">
            {[
              { label: 'Notifikasi stok rendah', desc: 'Diberitahu jika barang hampir habis', defaultChecked: true },
              { label: 'Laporan mingguan', desc: 'Ringkasan penjualan dikirim via email', defaultChecked: false },
              { label: 'Pembaruan sistem', desc: 'Info fitur baru & peningkatan', defaultChecked: true }
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="mt-1" />
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
