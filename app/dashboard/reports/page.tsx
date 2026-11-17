'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Package, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
const [dateRange, setDateRange] = useState({
  from: '',
  to: ''
});

useEffect(() => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  setDateRange({ from: thirtyDaysAgo, to: today });

  const stored = localStorage.getItem('karsapos_user');
  if (!stored) { router.push('/login'); return; }
  const u = JSON.parse(stored);
  setUser(u);
  if (u.businessId) loadTransactions(u.businessId);
}, [router]);

  const loadTransactions = async (businessId: string) => {
    try {
      const res = await fetch(
        `/api/transactions?businessId=${businessId}&from=${dateRange.from}&to=${dateRange.to}`
      );
      const data = await res.json();
      setTransactions(data);
    } catch (e) { console.error(e); }
  };

  const totalSales = transactions.reduce((s, t) => s + Number(t.totalAmount), 0);
  const totalTransactions = transactions.length;
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Laporan Penjualan</h2>
      
      {/* Filter Tanggal */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Dari</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Sampai</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={() => loadTransactions(user.businessId)}
          className="self-end bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          Tampilkan
        </button>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <TrendingUp size={20} className="text-teal-600" />
            </div>
            <span className="text-sm text-gray-500">Total Penjualan</span>
          </div>
          <p className="text-xl font-bold text-gray-800">Rp {totalSales.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Transaksi</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{totalTransactions}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Rata-rata</span>
          </div>
          <p className="text-xl font-bold text-gray-800">Rp {avgTransaction.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar size={20} className="text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Periode</span>
          </div>
          <p className="text-sm font-medium text-gray-800">{dateRange.from} — {dateRange.to}</p>
        </div>
      </div>

      {/* Daftar Transaksi */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <h3 className="px-4 py-3 bg-gray-50 border-b font-medium">Riwayat Transaksi</h3>
        {transactions.length === 0 ? (
          <p className="px-4 py-8 text-center text-gray-500">Belum ada transaksi pada periode ini</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2">No. Invoice</th>
                <th className="text-left px-4 py-2">Tanggal</th>
                <th className="text-left px-4 py-2">Metode</th>
                <th className="text-right px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{t.invoiceNo}</td>
                  <td className="px-4 py-2">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">{t.paymentMethod}</td>
                  <td className="px-4 py-2 text-right font-medium">Rp {Number(t.totalAmount).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
