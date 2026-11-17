'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, FileText } from 'lucide-react';

interface SaleItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  costPrice?: number;
}

interface Sale {
  invoiceNo: string;
  items: SaleItem[];
  total: number;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  stock: number;
}

export default function ProfitPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    setSales(JSON.parse(localStorage.getItem('karsapos_sales') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('karsapos_products') || '[]'));
  }, []);

  // Hitung laba per transaksi
  const calculateProfit = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cost = (product?.costPrice || 0) * item.quantity;
        const revenue = item.subtotal;
        totalRevenue += revenue;
        totalCost += cost;
        totalProfit += (revenue - cost);
      });
    });

    return { totalRevenue, totalCost, totalProfit, margin: totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0 };
  };

  const { totalRevenue, totalCost, totalProfit, margin } = calculateProfit();

  // Data grafik harian
  const chartData = sales.reduce((acc: any[], sale) => {
    const date = new Date(sale.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
    const existing = acc.find(d => d.date === date);
    
    let dayRevenue = 0, dayCost = 0;
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      dayRevenue += item.subtotal;
      dayCost += (product?.costPrice || 0) * item.quantity;
    });

    if (existing) {
      existing.revenue += dayRevenue;
      existing.cost += dayCost;
      existing.profit += (dayRevenue - dayCost);
    } else {
      acc.push({ date, revenue: dayRevenue, cost: dayCost, profit: (dayRevenue - dayCost) });
    }
    return acc;
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText size={24} className="text-teal-600" /> Laporan Laba & Rugi
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
              <p className="text-sm text-gray-500">Harga Modal</p>
              <p className="text-xl font-bold text-orange-600 mt-1">Rp {totalCost.toLocaleString('id-ID')}</p>
            </div>
            <Package size={32} className="text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Laba Bersih</p>
              <p className={`text-xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rp {totalProfit.toLocaleString('id-ID')}
              </p>
            </div>
            {totalProfit >= 0 ? <TrendingUp size={32} className="text-green-200" /> : <TrendingDown size={32} className="text-red-200" />}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Margin Laba</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{margin}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">%</div>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Tren Laba Harian</h2>
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Belum ada data penjualan
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `Rp${(v/1000).toFixed(0)}rb`} />
              <Tooltip
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                labelFormatter={(label) => `Tanggal: ${label}`}
              />
              <Bar dataKey="revenue" name="Pendapatan" fill="#0d9488" radius={[4,4,0,0]} />
              <Bar dataKey="profit" name="Laba" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detail Transaksi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-5 border-b">Rincian Per Transaksi</h2>
        {sales.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Belum ada transaksi.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">Faktur</th>
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-600">Pendapatan</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-
 text-gray-600">Modal</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-600">Laba</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-600">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.map(sale => {
                  let revenue = 0, cost = 0;
                  sale.items.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    revenue += item.subtotal;
                    cost += (product?.costPrice || 0) * item.quantity;
                  });
                  const profit = revenue - cost;
                  const marginPct = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0;
                  return (
                    <tr key={sale.invoiceNo} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-sm">{sale.invoiceNo}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {new Date(sale.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3 text-right">Rp {revenue.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3 text-right text-orange-600">Rp {cost.toLocaleString('id-ID')}</td>
                      <td className={`px-5 py-3 text-right font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rp {profit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3 text-right">{marginPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
