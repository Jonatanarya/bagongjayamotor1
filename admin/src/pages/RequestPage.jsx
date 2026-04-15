import { useState, useRef, useCallback, useEffect } from 'react';
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

/* ------------------------------------------------------------------ */
/*  Collect available photos for a request                             */
/* ------------------------------------------------------------------ */
function getRequestPhotos(request) {
  const photos = [];
  if (request.fotoDepan) photos.push({ src: request.fotoDepan, label: 'Tampak Depan' });
  if (request.fotoBelakang) photos.push({ src: request.fotoBelakang, label: 'Tampak Belakang' });
  if (request.fotoSampingKiri) photos.push({ src: request.fotoSampingKiri, label: 'Samping Kiri' });
  if (request.fotoSampingKanan) photos.push({ src: request.fotoSampingKanan, label: 'Samping Kanan' });
  if (request.fotoSTNKBPKB) photos.push({ src: request.fotoSTNKBPKB, label: 'STNK + BPKB' });
  if (photos.length === 0 && request.imageUrl) {
    photos.push({ src: request.imageUrl, label: 'Foto Utama' });
  } else if (request.imageUrl && !photos.find((p) => p.src === request.imageUrl)) {
    photos.unshift({ src: request.imageUrl, label: 'Foto Utama' });
  }
  if (photos.length === 0) {
    photos.push({ src: DEFAULT_IMAGE, label: 'Tidak ada foto' });
  }
  return photos;
}

/* ------------------------------------------------------------------ */
/*  Full-screen Lightbox with zoom + swipe                             */
/* ------------------------------------------------------------------ */
function Lightbox({ photos, initialIndex, title, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const slideCount = photos.length;

  const goTo = useCallback(
    (idx) => {
      setZoomed(false);
      setCurrentIndex((idx + slideCount) % slideCount);
    },
    [slideCount],
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, goTo, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleImageClick = (e) => {
    if (zoomed) {
      setZoomed(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
      setZoomed(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  /* Touch swipe */
  const onTouchStart = (e) => {
    if (zoomed) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    if (zoomed || touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (zoomed) return;
    if (Math.abs(touchDeltaX.current) > 60) {
      if (touchDeltaX.current < 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const photo = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div>
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-slate-400 text-sm">
            {photo.label} — {currentIndex + 1} / {slideCount}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed(!zoomed)}
            className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title={zoomed ? 'Perkecil' : 'Perbesar'}
          >
            <span className="material-symbols-outlined">{zoomed ? 'zoom_out' : 'zoom_in'}</span>
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative min-h-0 px-4 pb-4 select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Left arrow */}
        {slideCount > 1 && (
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
        )}

        {/* Image container */}
        <div
          className="relative max-w-full max-h-full overflow-hidden rounded-2xl"
          style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        >
          <img
            key={currentIndex}
            src={photo.src}
            alt={photo.label}
            draggable={false}
            className="block max-h-[75vh] max-w-full object-contain transition-transform duration-300 ease-out"
            style={
              zoomed
                ? {
                    transform: 'scale(2.5)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : {}
            }
          />
        </div>

        {/* Right arrow */}
        {slideCount > 1 && (
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {slideCount > 1 && (
        <div className="shrink-0 flex items-center justify-center gap-2 px-6 pb-6 pt-2">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`cursor-pointer relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105'
                  : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/30'
              }`}
            >
              <img src={p.src} alt={p.label} className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
function RequestPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [deleteItem, setDeleteItem] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { request, index }

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
                  filteredRequests.map((request) => {
                    const photos = getRequestPhotos(request);
                    return (
                      <tr key={request.id} className="hover:bg-white/3 transition-colors align-top">
                        <td className="px-5 py-4 text-slate-400 font-mono text-xs">{request.id}</td>
                        <td className="px-5 py-4">
                          {/* Clickable thumbnail with zoom hint */}
                          <div
                            onClick={() => setLightbox({ request, index: 0 })}
                            className="relative group/thumb cursor-pointer w-14 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all"
                          >
                            <img
                              src={photos[0]?.src || DEFAULT_IMAGE}
                              alt={`${request.merk} ${request.tipe}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 flex items-center justify-center transition-all">
                              <span className="material-symbols-outlined text-white text-sm opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                zoom_in
                              </span>
                            </div>
                            {/* Photo count badge */}
                            {photos.length > 1 && (
                              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {photos.length}
                              </span>
                            )}
                          </div>
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
                              onClick={() => setLightbox({ request, index: 0 })}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">zoom_in</span>
                              Foto
                            </button>
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
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
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

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={getRequestPhotos(lightbox.request)}
          initialIndex={lightbox.index}
          title={`${lightbox.request.merk} ${lightbox.request.tipe} (${lightbox.request.tahun}) — ${lightbox.request.customerName}`}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

export default RequestPage;
