import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, LogOut, Plus, Edit, Trash2, Save, Download } from 'lucide-react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'berita' | 'edukasi' | 'informasi'>('berita');
  const [loading, setLoading] = useState(false);

  // Data states
  const [berita, setBerita] = useState<any[]>([]);
  const [edukasi, setEdukasi] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resBerita, resEdukasi, resSettings] = await Promise.all([
        fetch('/api/berita'),
        fetch('/api/edukasi'),
        fetch('/api/settings')
      ]);
      setBerita(await resBerita.json());
      setEdukasi(await resEdukasi.json());
      setSettings(await resSettings.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else {
        alert('Password salah!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  // --- Handlers for Berita ---
  const saveBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem.id ? 'PUT' : 'POST';
    const url = editingItem.id ? `/api/berita/${editingItem.id}` : '/api/berita';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    setEditingItem(null);
    fetchData();
  };

  const deleteBerita = async (id: number) => {
    if (!confirm('Hapus berita ini?')) return;
    await fetch(`/api/berita/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // --- Handlers for Edukasi ---
  const saveEdukasi = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem.id ? 'PUT' : 'POST';
    const url = editingItem.id ? `/api/edukasi/${editingItem.id}` : '/api/edukasi';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    setEditingItem(null);
    fetchData();
  };

  const deleteEdukasi = async (id: number) => {
    if (!confirm('Hapus edukasi ini?')) return;
    await fetch(`/api/edukasi/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // --- Handlers for Settings ---
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('Informasi berhasil disimpan!');
    fetchData();
  };

  const handleExport = () => {
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const stringified = String(str);
      if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    let csvContent = "=== DATA BERITA ===\n";
    csvContent += "ID,Judul,Tanggal,Lokasi,Kategori,Ringkasan,Konten,URL Gambar\n";
    berita.forEach(b => {
      csvContent += [b.id, b.title, b.date, b.location, b.category, b.excerpt, b.content, b.image].map(escapeCsv).join(',') + "\n";
    });

    csvContent += "\n=== DATA EDUKASI ===\n";
    csvContent += "ID,Judul,Ikon,Konten\n";
    edukasi.forEach(e => {
      csvContent += [e.id, e.title, e.icon, e.content].map(escapeCsv).join(',') + "\n";
    });

    csvContent += "\n=== DATA INFORMASI ===\n";
    csvContent += "Key,Value\n";
    Object.entries(settings).forEach(([k, v]) => {
      csvContent += [k, typeof v === 'object' ? JSON.stringify(v) : v].map(escapeCsv).join(',') + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-950">
              Admin Panel
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Silakan login untuk mengelola konten website
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-amber-500 group-hover:text-amber-400" aria-hidden="true" />
                </span>
                {loading ? 'Memproses...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950">Dashboard Admin</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Export Spreadsheet
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-200">
          {['berita', 'edukasi', 'informasi'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setEditingItem(null); }}
              className={`pb-4 px-2 text-sm font-medium capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-amber-600 text-amber-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          
          {/* --- BERITA TAB --- */}
          {activeTab === 'berita' && (
            <div>
              {!editingItem ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-950">Kelola Berita</h2>
                    <button 
                      onClick={() => setEditingItem({ title: '', date: '', location: '', category: '', image: '', excerpt: '' })}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                    >
                      <Plus className="w-4 h-4" /> Tambah Berita
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {berita.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => deleteBerita(item.id)} className="text-rose-600 hover:text-rose-900"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <form onSubmit={saveBerita} className="space-y-4 max-w-2xl">
                  <h2 className="text-xl font-bold text-blue-950 mb-6">{editingItem.id ? 'Edit Berita' : 'Tambah Berita'}</h2>
                  <div><label className="block text-sm font-medium text-slate-700">Judul</label><input required type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">Tanggal</label><input required type="text" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">Lokasi</label><input required type="text" value={editingItem.location} onChange={e => setEditingItem({...editingItem, location: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">Kategori</label><input required type="text" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">URL Gambar</label><input required type="text" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">Ringkasan</label><textarea required rows={3} value={editingItem.excerpt} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div><label className="block text-sm font-medium text-slate-700">Konten Lengkap</label><textarea required rows={6} value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"><Save className="w-4 h-4" /> Simpan</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300">Batal</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* --- EDUKASI TAB --- */}
          {activeTab === 'edukasi' && (
            <div>
              {!editingItem ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-950">Kelola Edukasi</h2>
                    <button 
                      onClick={() => setEditingItem({ title: '', icon: 'BookOpen', content: '' })}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                    >
                      <Plus className="w-4 h-4" /> Tambah Edukasi
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {edukasi.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => deleteEdukasi(item.id)} className="text-rose-600 hover:text-rose-900"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <form onSubmit={saveEdukasi} className="space-y-4 max-w-2xl">
                  <h2 className="text-xl font-bold text-blue-950 mb-6">{editingItem.id ? 'Edit Edukasi' : 'Tambah Edukasi'}</h2>
                  <div><label className="block text-sm font-medium text-slate-700">Judul</label><input required type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Ikon (BookOpen, AlertTriangle, ShieldCheck, HeartPulse)</label>
                    <input required type="text" value={editingItem.icon} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700">Konten</label><textarea required rows={6} value={editingItem.content} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" /></div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"><Save className="w-4 h-4" /> Simpan</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300">Batal</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* --- INFORMASI TAB --- */}
          {activeTab === 'informasi' && (
            <form onSubmit={saveSettings} className="space-y-4 max-w-2xl">
              <h2 className="text-xl font-bold text-blue-950 mb-6">Kelola Informasi Organisasi</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Visi</label>
                <textarea required rows={3} value={settings.visi || ''} onChange={e => setSettings({...settings, visi: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Misi (Pisahkan dengan baris baru)</label>
                <textarea required rows={6} value={(settings.misi || []).join('\n')} onChange={e => setSettings({...settings, misi: e.target.value.split('\n').filter((s: string) => s.trim() !== '')})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Alamat</label>
                <input required type="text" value={settings.alamat || ''} onChange={e => setSettings({...settings, alamat: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Telepon / WhatsApp</label>
                <input required type="text" value={settings.telepon || ''} onChange={e => setSettings({...settings, telepon: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input required type="email" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" />
              </div>

              <div className="pt-4">
                <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
