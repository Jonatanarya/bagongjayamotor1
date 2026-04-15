import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient.js';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80';

const emptyForm = {
  merk: '',
  tipe: '',
  tahun: '',
  harga: '',
  kilometer: '',
  status: 'Tersedia',
  imageUrl: '',
  fotoDepan: '',
  fotoBelakang: '',
  fotoSampingKiri: '',
  fotoSampingKanan: '',
};

const formatRp = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
const parseNumber = (value) => Number(String(value || '').replace(/[^\d]/g, '')) || 0;

function StockPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState(null);
  const [fotoPreviews, setFotoPreviews] = useState({ depan: null, belakang: null, sampingKiri: null, sampingKanan: null });

  const { data: motors = [], isLoading, error } = useQuery({
    queryKey: ['motors', search, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (filterStatus !== 'Semua') params.set('status', filterStatus);
      params.set('limit', '100');

      const query = params.toString();
      const response = await apiClient.get(`/motors${query ? `?${query}` : ''}`);
      return response?.data?.motors ?? [];
    },
  });

  const { data: stockSummary } = useQuery({
    queryKey: ['motors', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get('/motors/dashboard/summary');
      return response?.data ?? {};
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editItem) {
        return apiClient.put(`/motors/${editItem.id}`, payload);
      }
      return apiClient.post('/motors', payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['motors'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
      setModalOpen(false);
      setEditItem(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => apiClient.delete(`/motors/${id}`),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['motors'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
      setDeleteItem(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => apiClient.patch(`/motors/${id}/status`, { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['motors'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
  });

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setFotoPreviews({ depan: null, belakang: null, sampingKiri: null, sampingKanan: null });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      merk: item.merk ?? '',
      tipe: item.tipe ?? '',
      tahun: String(item.tahun ?? ''),
      harga: String(item.harga ?? ''),
      kilometer: String(item.kilometer ?? ''),
      status: item.status ?? 'Tersedia',
      imageUrl: item.imageUrl ?? '',
      fotoDepan: item.fotoDepan ?? '',
      fotoBelakang: item.fotoBelakang ?? '',
      fotoSampingKiri: item.fotoSampingKiri ?? '',
      fotoSampingKanan: item.fotoSampingKanan ?? '',
    });
    setFotoPreviews({
      depan: item.fotoDepan ?? null,
      belakang: item.fotoBelakang ?? null,
      sampingKiri: item.fotoSampingKiri ?? null,
      sampingKanan: item.fotoSampingKanan ?? null,
    });
    setModalOpen(true);
  };

  const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e, photoType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const compressed = await compressImage(file);
    setFotoPreviews((prev) => ({ ...prev, [photoType]: compressed }));
    setForm((prev) => {
      const photoFieldMap = {
        depan: 'fotoDepan',
        belakang: 'fotoBelakang',
        sampingKiri: 'fotoSampingKiri',
        sampingKanan: 'fotoSampingKanan',
      };
      return { ...prev, [photoFieldMap[photoType]]: compressed };
    });
  };

  const handleSave = async () => {
    if (!form.merk || !form.tipe || !form.tahun || !form.harga) return;

    await saveMutation.mutateAsync({
      merk: form.merk.trim(),
      tipe: form.tipe.trim(),
      tahun: Number(form.tahun),
      harga: parseNumber(form.harga),
      kilometer: form.kilometer ? Number(form.kilometer) : null,
      status: form.status,
      imageUrl: form.imageUrl.trim() || null,
      fotoDepan: form.fotoDepan.trim() || null,
      fotoBelakang: form.fotoBelakang.trim() || null,
      fotoSampingKiri: form.fotoSampingKiri.trim() || null,
      fotoSampingKanan: form.fotoSampingKanan.trim() || null,
    });
  };

  const inputClass =
    'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all text-sm';

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Manajemen Stok Motor</h2>
            <p className="text-slate-400 text-sm">
              {stockSummary?.available ?? 0} unit tersedia, {stockSummary?.sold ?? 0} unit terjual
            </p>
          </div>
          <button
            onClick={openAdd}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Motor
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-800/60 rounded-xl px-4 py-2.5 border border-white/5 flex-1 min-w-[200px] focus-within:border-orange-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-sm">search</span>
            <input
              className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
              placeholder="Cari motor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {['Semua', 'Tersedia', 'Terjual'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800/60 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            Gagal memuat stok motor: {error.message}
          </div>
        )}

        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Motor', 'Tahun', 'Harga', 'Kilometer', 'Status', 'Aksi'].map((heading) => (
                    <th
                      key={heading}
                      className={`px-6 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs ${
                        heading === 'Aksi' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Memuat data stok...
                    </td>
                  </tr>
                )}

                {!isLoading && motors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Tidak ada motor ditemukan
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  motors.map((item) => (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl || DEFAULT_IMAGE}
                            alt={`${item.merk} ${item.tipe}`}
                            className="w-12 h-9 object-cover rounded-lg shrink-0"
                          />
                          <div>
                            <div className="text-white font-semibold">
                              {item.merk} {item.tipe}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.tahun}</td>
                      <td className="px-6 py-4 text-orange-400 font-bold">{formatRp(item.harga)}</td>
                      <td className="px-6 py-4 text-slate-300">{item.kilometer ?? 0} km</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: item.id,
                              status: item.status === 'Tersedia' ? 'Terjual' : 'Tersedia',
                            })
                          }
                          disabled={statusMutation.isPending}
                          className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            item.status === 'Tersedia'
                              ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                              : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                          }`}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-6">{editItem ? 'Edit Motor' : 'Tambah Motor Baru'}</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {[
                { label: 'Merk', name: 'merk', placeholder: 'Honda, Yamaha...' },
                { label: 'Tipe', name: 'tipe', placeholder: 'CBR 250RR...' },
                { label: 'Tahun', name: 'tahun', placeholder: '2022', type: 'number' },
                { label: 'Harga', name: 'harga', placeholder: '58000000', type: 'number' },
                { label: 'Kilometer', name: 'kilometer', placeholder: '5000', type: 'number' },
                { label: 'Foto Utama (URL)', name: 'imageUrl', placeholder: 'https://...' },
                { label: 'Foto Tampak Depan (URL)', name: 'fotoDepan', placeholder: 'https://...' },
                { label: 'Foto Tampak Belakang (URL)', name: 'fotoBelakang', placeholder: 'https://...' },
                { label: 'Foto Tampak Samping Kiri (URL)', name: 'fotoSampingKiri', placeholder: 'https://...' },
                { label: 'Foto Tampak Samping Kanan (URL)', name: 'fotoSampingKanan', placeholder: 'https://...' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {field.label}
                  </label>
                  <input
                    className={inputClass}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(event) => setForm((previous) => ({ ...previous, [field.name]: event.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Status</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Terjual">Terjual</option>
                </select>
              </div>

              {/* Motor Photos Preview Grid */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Foto-Foto Motor</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'depan', label: 'Tampak Depan', icon: 'image_search' },
                    { key: 'belakang', label: 'Tampak Belakang', icon: 'image_search' },
                    { key: 'sampingKiri', label: 'Samping Kiri', icon: 'image_search' },
                    { key: 'sampingKanan', label: 'Samping Kanan', icon: 'image_search' },
                  ].map(({ key, label, icon }) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
                      <div
                        onClick={() => document.getElementById(`file-${key}`).click()}
                        className="border-2 border-dashed border-white/10 rounded-lg p-2 cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-center"
                      >
                        {fotoPreviews[key] ? (
                          <div className="relative">
                            <img src={fotoPreviews[key]} alt={label} className="w-full h-20 object-cover rounded" />
                            <p className="text-xs text-slate-400 mt-1">Klik untuk ubah</p>
                          </div>
                        ) : (
                          <div className="py-3">
                            <span className="material-symbols-outlined text-lg text-slate-500 block">{icon}</span>
                            <p className="text-xs text-slate-500 mt-1">Upload</p>
                          </div>
                        )}
                        <input
                          id={`file-${key}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, key)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {saveMutation.error && (
              <p className="mt-4 text-sm text-red-300">Gagal menyimpan data: {saveMutation.error.message}</p>
            )}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="cursor-pointer flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all"
              >
                {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">delete_forever</span>
            <h3 className="text-white font-bold text-xl mb-2">Hapus Motor?</h3>
            <p className="text-slate-400 text-sm mb-3">
              {deleteItem.merk} {deleteItem.tipe} akan dihapus permanen.
            </p>
            {deleteMutation.error && (
              <p className="text-sm text-red-300 mb-5">Gagal menghapus data: {deleteMutation.error.message}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteItem.id)}
                disabled={deleteMutation.isPending}
                className="cursor-pointer flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all"
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StockPage;
