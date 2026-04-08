import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const initialStock = [
  { id: 'MTR-001', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqvlAOuUbVFA2bLRsDo7xdlbae6y8kdyeInDn17I8BAvsyqpNW1eNCHKUMVq3FZK4t-7tkCnI81PLas04oAxx0vebIId0aCq_zpJOC2QuWQUNE1mAu4tSdx0B6_ENbvGnRzofaqQhSI8kh6g1a4nBL5bofiIfFt2iqcCMaxuWpNdOkFdC4130rOptynLirDfGRd54ilCbFExxwISY2uf8v10nDexcGHyLvu7u8bZuZqJb2e24v-4w5v0jInMyhti08r2JsATEcl1Df', merk: 'Honda', tipe: 'CBR 250RR', tahun: '2022', harga: 'Rp 58.000.000', status: 'Tersedia' },
  { id: 'MTR-002', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH2OO94QCk_llhMsoLkheQs-ZO8ZHUDFh70q7q-GfkR13F7Awn7JMOx1CrsvDhcXsQ6fCxPai_Wck3MGlV0_aL-VOW4faBCSOeKu0wfqi-J4HfIaVgI3q7aCDNmUDBctHcs3GZSM8B1k_6IO1GKWk_Wcfx9FkUS3MtA9M5ppJn9GxzVpIttsbrO8TS1U0PD3aItmIndBkowI-3FzSKGMsmlOOz_y2HESGbqA_pLpNA8AJogyMH0uPZEGNzNbhD7gKbFvpYJ0o65VPr', merk: 'Yamaha', tipe: 'XSR 155', tahun: '2021', harga: 'Rp 32.000.000', status: 'Tersedia' },
  { id: 'MTR-003', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHPBktpzyfgQkfmuZ2e3oQiCvPXsOUF5FPtcoPlUe-ehK5zKNJSLHiLBjGtt-rw3lxDwKJnlTYoU-Ahusyqcz9modLJ9Nsq0f5oXglLpOrwFlb-3YNCjMMIniqvRXAfhvouSVret8XdiROG4qvQW1skzIgmkkm7nvQsIf-h8sCj8_mbe_Bt1oNfbZasAHPFRC4IbhStocu-PBSkP7KhvCNdUwa8mdtbzyyQEdiWQd9EPsdeIKJx2LtwQFJ9aWEDKlUENfmg3IwzbFS', merk: 'Kawasaki', tipe: 'Ninja ZX25R', tahun: '2023', harga: 'Rp 115.000.000', status: 'Terjual' },
  { id: 'MTR-004', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvyN0E9DOHr748WuIcuBshBGI8VYWoR9qRpm42aaxHbdAwbAguD8kHkzkfozcfbBOw0owdjCyBveOwv17udNmISR3B8jCiE9nE8sDmA_AnL9Dn6HFqOMAHlelkcgBrrZt9pvqEPaySdmSPjyBnMwf7ifVELFeslovy8panxEmY0h3CL6Df8GNSHJ0eJSnxjZCr90vBY_HKdpUuMfdBLpyEkvd6jvrlnZXCdQuc0anqLqPzFZTPNkePzgRb3XE5Hn0FZbT3riUVlQE', merk: 'Honda', tipe: 'Vario 160', tahun: '2022', harga: 'Rp 22.000.000', status: 'Tersedia' },
];

const emptyForm = { merk: '', tipe: '', tahun: '', harga: '', status: 'Tersedia' };

function StockPage() {
  const [stocks, setStocks] = useState(initialStock);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = stocks.filter((s) => {
    const matchSearch = `${s.merk} ${s.tipe}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ merk: item.merk, tipe: item.tipe, tahun: item.tahun, harga: item.harga, status: item.status }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.merk || !form.tipe || !form.tahun || !form.harga) return;
    if (editItem) {
      setStocks((prev) => prev.map((s) => s.id === editItem.id ? { ...s, ...form } : s));
    } else {
      const newId = `MTR-${String(stocks.length + 1).padStart(3, '0')}`;
      setStocks((prev) => [...prev, { id: newId, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvyN0E9DOHr748WuIcuBshBGI8VYWoR9qRpm42aaxHbdAwbAguD8kHkzkfozcfbBOw0owdjCyBveOwv17udNmISR3B8jCiE9nE8sDmA_AnL9Dn6HFqOMAHlelkcgBrrZt9pvqEPaySdmSPjyBnMwf7ifVELFeslovy8panxEmY0h3CL6Df8GNSHJ0eJSnxjZCr90vBY_HKdpUuMfdBLpyEkvd6jvrlnZXCdQuc0anqLqPzFZTPNkePzgRb3XE5Hn0FZbT3riUVlQE', ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { setStocks((prev) => prev.filter((s) => s.id !== id)); setDeleteId(null); };
  const toggleStatus = (id) => { setStocks((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === 'Tersedia' ? 'Terjual' : 'Tersedia' } : s)); };

  const inputClass = "w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all text-sm";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Manajemen Stok Motor</h2>
            <p className="text-slate-400 text-sm">{stocks.filter(s => s.status === 'Tersedia').length} unit tersedia</p>
          </div>
          <button onClick={openAdd} className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Motor
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-800/60 rounded-xl px-4 py-2.5 border border-white/5 flex-1 min-w-[200px] focus-within:border-orange-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-sm">search</span>
            <input className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full" placeholder="Cari motor..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {['Semua', 'Tersedia', 'Terjual'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filterStatus === s ? 'bg-orange-500 text-white' : 'bg-slate-800/60 text-slate-400 border border-white/5 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Motor', 'Tahun', 'Harga', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className={`px-6 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs ${h === 'Aksi' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Tidak ada motor ditemukan</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.img} alt={item.tipe} className="w-12 h-9 object-cover rounded-lg shrink-0" />
                        <div>
                          <div className="text-white font-semibold">{item.merk} {item.tipe}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{item.tahun}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{item.harga}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(item.id)} className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold transition-all ${item.status === 'Tersedia' ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25' : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'}`}>
                        {item.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-6">{editItem ? 'Edit Motor' : 'Tambah Motor Baru'}</h3>
            <div className="space-y-4">
              {[{ label: 'Merk', name: 'merk', placeholder: 'Honda, Yamaha...' }, { label: 'Tipe', name: 'tipe', placeholder: 'CBR 250RR...' }, { label: 'Tahun', name: 'tahun', placeholder: '2022' }, { label: 'Harga', name: 'harga', placeholder: 'Rp 50.000.000' }].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                  <input className={inputClass} placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Status</label>
                <select className={inputClass} value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Terjual">Terjual</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalOpen(false)} className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">Batal</button>
              <button onClick={handleSave} className="cursor-pointer flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">delete_forever</span>
            <h3 className="text-white font-bold text-xl mb-2">Hapus Motor?</h3>
            <p className="text-slate-400 text-sm mb-8">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="cursor-pointer flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default StockPage;
