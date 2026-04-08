import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

function SuggestionAdminPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const parseResponse = async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return { text };
      }
    };

    const fetchSuggestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/suggestions');
        if (!response.ok) {
          const errorData = await parseResponse(response);
          throw new Error(errorData.error || errorData.text || `Gagal memuat saran (${response.status})`);
        }
        const result = await parseResponse(response);
        setSuggestions(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat saran.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleDelete = (id) => { setSuggestions((prev) => prev.filter((s) => s.id !== id)); setDeleteId(null); };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-white font-bold text-xl">Saran Customer</h2>
          <p className="text-slate-400 text-sm">{loading ? 'Memuat saran...' : `${suggestions.length} saran masuk dari pelanggan`}</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-100">
            <p className="font-semibold">Gagal memuat saran</p>
            <p className="text-sm text-red-200 mt-2">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-24 text-slate-400">Memuat data saran...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-slate-700 block mb-4">forum</span>
            <p className="text-slate-500">Belum ada saran masuk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {suggestions.map((sgt) => (
              <div key={sgt.id} className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-orange-500 text-lg">person</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{sgt.nama}</div>
                      <div className="text-slate-500 text-xs">{sgt.tanggal}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(sgt.id)}
                    className="cursor-pointer p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-orange-500/30 pl-4">
                  {sgt.pesan}
                </p>
                <div className="mt-3 text-slate-500 font-mono text-[10px]">{sgt.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">delete_forever</span>
            <h3 className="text-white font-bold text-xl mb-2">Hapus Saran?</h3>
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

export default SuggestionAdminPage;
