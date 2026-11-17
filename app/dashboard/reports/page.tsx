'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Sale {
  invoiceNo: string;
  items: SaleItem[];
  total: number;
  customer?: { name: string };
  date: string;
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_sales');
    if (saved) setSales(JSON.parse(saved));
  }, []);

  // Ringkasan
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = sales.length;
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalItems = sales.reduce((sum, s) => sum + s.items.reduce((i, item) => i + item.quantity, 0), 0);

  // Data untuk grafik
  const groupByDate = () => {
    const grouped: Record<string, number> = {};
    sales.forEach(sale
 => {
      const date = new Date(sale.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit'
      });
      grouped[date] = (grouped[date] || 0) + sale.total;
    });
    return Object.entries(grouped).map(([date, total]) => ({ date, total }));
  };

  const chartData = groupByDate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText size={24} className="text-teal-600" /> Laporan Penjualan
      </h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pendapatan</p>
              <p className="text-xl font-bold text-teal-600 mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            </div>
            <DollarSign size={32} className="text-teal-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{totalTransactions}</p>
            </div>
            <ShoppingCart size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rata-rata Transaksi</p>
              <p className="text-xl font-bold text-orange-600 mt-1">Rp {avgTransaction.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
            </div>
            <TrendingUp size={32} className="text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Barang Terjual</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{totalItems}</p>
            </div>
            <Users size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Grafik Penjualan</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('week')}
                className={`px-3 py-1 text-sm rounded ${period === 'week' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 text-sm rounded ${period === 'month' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
              >
                30 Hari
              </button>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Belum ada data penjualan
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `Rp${(v/1000).toFixed(0)}rb`} />
                <Tooltip
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Tren Penjualan</h2>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Belum ada data penjualan
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `Rp${(v/1000).toFixed(0)}rb`} />
                <Tooltip
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2} dot={{ fill: '#0d9488' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Daftar Transaksi Terbaru */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-5 border-b">Riwayat Transaksi Terbaru</h2>
        {sales.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            Belum ada transaksi. Mulai jual di halaman Kasir!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">No. Faktur</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">Pelanggan</th>
                  <th className="px-5 py-3 text-center text-sm font-medium text-gray-600">Item</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.slice(0, 10).map(s => (
                  <tr key={s.invoiceNo} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-sm font-medium">{s.invoiceNo}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(s.date).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3 text-sm">{s.customer?.name || 'Pelanggan Umum'}</td>
                    <td className="px-5 py-3 text-center text-sm">{s.items.length}</td>
                    <td className="px-5 py-3 text-right font-semibold text-teal-600">
                      Rp {s.total.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
