'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const saved = localStorage.getItem('karsapos_categories');
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('karsapos_categories', JSON.stringify(categories));
  }, [categories]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCategories(categories.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCategories([...categories, { id: Date.now().toString(), ...form }]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus kategori ini? Produk di dalamnya tidak ikut terhapus.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FolderOpen size={24} className="text-teal-600" /> Kategori Produk
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Belum ada kategori. Buat kategori pertama untuk mengelompokkan produk.
          </div>
        ) : categories.map(c => (
          <div key={c.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                {c.description && <p className="text-sm text-gray-500 mt-1">{c.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setShowModal(true); }} className="text-blue-600 p-1"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                <input
                  type="text" value={form.name} required
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
