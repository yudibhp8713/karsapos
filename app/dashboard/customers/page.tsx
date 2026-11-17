'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Search, Phone, Mail, MapPin } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_customers');
    if (saved) setCustomers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('karsapos_customers', JSON.stringify(customers));
  }, [customers]);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCustomers(customers.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
    }
    resetForm();
  };

  const handleEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || '', email: c.email || '', address: c.address || '' });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data pelanggan ini?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', address: '' });
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User size={24} className="text-teal-600" /> Data Pelanggan
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
        >
          <Plus size={18} /> Tambah Pelanggan
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada data pelanggan. Klik "Tambah Pelanggan" untuk memulai.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(c => (
              <div key={c.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      {c.phone && <p className="flex items-center gap-2"><Phone size={14} /> {c.phone}</p>}
                      {c.email && <p className="flex items-center gap-2"><Mail size={14} /> {c.email}</p>}
                      {c.address && <p className="flex items-center gap-2"><MapPin size={14} /> {c.address}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 p-1 hover:bg-blue-50 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 p-1 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={3}
                />
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
