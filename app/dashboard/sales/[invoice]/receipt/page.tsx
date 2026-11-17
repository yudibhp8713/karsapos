'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

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
  customer?: { name: string; phone?: string };
  date: string;
  paymentMethod?: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_sales');
    if (saved) {
      const sales = JSON.parse(saved);
      const found = sales.find((s: Sale) => s.invoiceNo === params.invoice);
      setSale(found || null);
    }
  }, [params.invoice]);

  const handlePrint = () => {
    window.print();
  };

  if (!sale) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Faktur tidak ditemukan</p>
        <button onClick={() => router.back()} className="mt-4 text-teal-600">Kembali</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* Tombol Aksi — tidak tercetak */}
      <div className="max-w-sm mx-auto mb-6 print:hidden">
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-white"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Printer size={16} /> Cetak
          </button>
        </div>
      </div>

      {/* Struk — area yang dicetak */}
      <div className="max-w-sm mx-auto bg-white p-6 shadow print:shadow-none print:p-4">
        {/* Header Toko */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">KarsaPOS</h2>
          <p className="text-xs text-gray-500">Sistem Kasir & Manajemen Usaha</p>
          <p className="text-xs text-gray-500">Jl. Contoh Alamat No. 123, Kota</p>
          <p className="text-xs text-gray-500">────────────────────</p>
        </div>

        {/* Info Transaksi */}
        <div className="text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span>No. Faktur</span>
            <span className="font-mono">{sale.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal</span>
            <span>{new Date(sale.date).toLocaleString('id-ID')}</span>
          </div>
          {sale.customer && (
            <div className="flex justify-between">
              <span>Pelanggan</span>
              <span>{sale.customer.name}</span>
            </div>
          )}
        </div>

        {/* Garis Pemisah */}
        <p className="text-xs text-gray-300 mb-2">────────────────────</p>

        {/* Daftar Barang */}
        <div className="text-xs space-y-1 mb-4">
          {sale.items.map((item, i) => (
            <div key={i}>
              <div className="font-medium">{item.name}</div>
              <div className="flex justify-between text-gray-500">
                <span>{item.quantity} × Rp {item.price.toLocaleString('id-ID')}</span>
                <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Garis Pemisah */}
        <p className="text-xs text-gray-300 mb-2">────────────────────</p>

        {/* Total */}
        <div className="flex justify-between font-bold text-base mb-4">
          <span>TOTAL</span>
          <span>Rp {sale.total.toLocaleString('id-ID')}</span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Terima Kasih</p>
          <p>Semoga Berkunjung Kembali</p>
          <p className="mt-2">——— KarsaPOS ———</p>
        </div>
      </div>

      {/* CSS Khusus Mode Cetak */}
      <style jsx global>{`
        @media print {
          body { margin: 0; background: white; }
          button, .no-print { display: none !important; }
          .print\:shadow-none { box-shadow: none !important; }
          @page { size: 80mm auto; margin: 0; }
        }
      `}</style>
    </div>
  );
}
