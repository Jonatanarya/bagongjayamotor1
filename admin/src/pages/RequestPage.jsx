import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient.js';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80';

const formatRp = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

function normalizeWhatsApp(rawNumber) {
  const digits = String(rawNumber || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

function RequestPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [deleteItem, setDeleteItem] = useState(null);

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await apiClient.get('/requests');
      return response?.data ?? [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => apiClient.put(`/requests/${id}`, { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['requests'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => apiClient.delete(`/requests/${id}`),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['requests'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
      setDeleteItem(null);
    },
  });

  const openWhatsApp = (number) => {
    const normalized = normalizeWhatsApp(number);
    if (!normalized) return;
    window.open(`https://wa.me/${normalized}`, '_blank', 'noopener,noreferrer');
  };

  const filteredRequests =
    statusFilter === 'Semua' ? requests : requests.filter((item) => item.status === statusFilter);

  const statusTone = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-500/15 text-green-400';
      case 'Rejected':
        return 'bg-red-500/15 text-red-400';
      case 'Contacted':
        return 'bg-blue-500/15 text-blue-400';
      default:
        return 'bg-yellow-500/15 text-yellow-300';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Request Pembelian</h2>
            <p className="text-slate-400 text-sm">{requests.length} penawaran masuk dari pelanggan</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Semua', 'Pending', 'Contacted', 'Accepted', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800/60 text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {(error || updateStatusMutation.error || deleteMutation.error) && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error?.message || updateStatusMutation.error?.message || deleteMutation.error?.message}
          </div>
        )}

        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Foto', 'Pengirim', 'No. WA', 'Motor', 'Harga', 'Tanggal', 'Status', 'Aksi'].map((heading) => (
                    <th key={heading} className="px-5 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-xs">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-500">
                      Memuat request pelanggan...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-500">
                      Tidak ada request untuk filter ini.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-white/3 transition-colors align-top">
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs">{request.id}</td>
                      <td className="px-5 py-4">
                        <img
                          src={request.imageUrl || DEFAULT_IMAGE}
                          alt={`${request.merk} ${request.tipe}`}
                          className="w-14 h-10 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-white font-medium">{request.customerName}</div>
                        <div className="text-slate-500 text-xs mt-1">{request.customerAddress}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-300 font-mono text-xs">{request.customerWa}</td>
                      <td className="px-5 py-4 text-slate-300">
                        <div>
                          {request.merk} {request.tipe}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">Tahun {request.tahun}</div>
                      </td>
                      <td className="px-5 py-4 text-orange-400 font-bold">{formatRp(request.hargaPenawaran)}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{formatDate(request.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusTone(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openWhatsApp(request.customerWa)}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            WA
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'Contacted' })}
                            className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all"
                          >
                            Hubungi
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'Accepted' })}
                            className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'Rejected' })}
                            className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => setDeleteItem(request)}
                            className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
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

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">delete_forever</span>
            <h3 className="text-white font-bold text-xl mb-2">Hapus Request?</h3>
            <p className="text-slate-400 text-sm mb-3">
              Request dari {deleteItem.customerName} akan dihapus permanen.
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

export default RequestPage;
