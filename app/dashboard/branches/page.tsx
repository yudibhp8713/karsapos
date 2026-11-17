'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, MapPin, Phone } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', isActive: true });

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_branches');
    if (saved) setBranches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('karsapos_branches', JSON.stringify(branches));
  }, [branches]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setBranches(branches.map(b => b.id === editing.id ? { ...b, ...form } : b));
    } else {
      setBranches([...branches, { id: Date.now().toString(), ...form }]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus cabang ini? Pengguna dan transaksi tidak ikut terhapus.')) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  const resetForm = () => {
    setForm({ name: '', address: '', phone: '', isActive: true });
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 size={24} className="text-teal-600" /> Kelola Cabang
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
        >
          <Plus size={18} /> Tambah Cabang
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Belum ada cabang. Tambahkan cabang pertama untuk usaha Anda.
            <p className="text-sm mt-2">Fitur ini tersedia di paket Enterprise</p>
          </div>
        ) : branches.map(b => (
          <div key={b.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{b.name}</h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {b.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              {b.address && <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> {b.address}</p>}
              {b.phone && <p className="flex items-center gap-2"><Phone size={14} /> {b.phone}</p>}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => { setEditing(b); setForm({ name: b.name, address: b.address || '', phone: b.phone || '', isActive: b.isActive }); setShowModal(true); }}
                className="flex-1 text-sm text-blue-600 py-1 border rounded hover:bg-blue-50 flex items-center justify-center gap-1"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-sm text-red-600 py-1 border rounded hover:bg-red-50 px-2"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Contoh: Cabang Jakarta Pusat"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({...form, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Cabang Aktif</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
