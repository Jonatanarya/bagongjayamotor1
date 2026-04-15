import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestService } from '../../services/requestService.js';

function SellMotorPage() {
  const [form, setForm] = useState({ nama: '', wa: '', alamat: '', merk: '', tipe: '', tahun: '', kilometer: '', harga: '', deskripsi: '' });
  const [previews, setPreviews] = useState({ depan: null, belakang: null, sampingKiri: null, sampingKanan: null, stnkBpkb: null });
  const [submitted, setSubmitted] = useState(false);
  const [draggingField, setDraggingField] = useState(null);

  const submitRequest = useMutation({
    mutationFn: requestService.submitSellRequest,
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'harga') {
      const raw = value.replace(/\D/g, '');
      const formatted = raw ? `Rp ${parseInt(raw, 10).toLocaleString('id-ID')}` : '';
      setForm((current) => ({ ...current, harga: formatted }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFile = (file, fieldName) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreviews((current) => ({ ...current, [fieldName]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    setDraggingField(null);
    const file = e.dataTransfer.files[0];
    handleFile(file, fieldName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submitRequest.mutate({
      ...form,
      tahun: Number(form.tahun),
      hargaPenawaran: Number(form.harga.replace(/\D/g, '') || 0),
      imageUrl: previews.depan,
      fotoDepan: previews.depan,
      fotoBelakang: previews.belakang,
      fotoSampingKiri: previews.sampingKiri,
      fotoSampingKanan: previews.sampingKanan,
      fotoSTNKBPKB: previews.stnkBpkb,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-8">
        <div className="glass-card rounded-[2rem] p-16 text-center max-w-md border border-green-500/20">
          <span className="material-symbols-outlined text-6xl text-green-500 block mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <h2 className="text-3xl font-black italic tracking-tighter mb-3">Penawaran Terkirim!</h2>
          <p className="text-slate-400 mb-8">Data Anda sudah tersimpan ke backend dan tim kami akan menghubungi Anda lewat WhatsApp.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ nama: '', wa: '', alamat: '', merk: '', tipe: '', tahun: '', kilometer: '', harga: '', deskripsi: '' });
              setPreviews({ depan: null, belakang: null, sampingKiri: null, sampingKanan: null, stnkBpkb: null });
            }}
            className="cursor-pointer px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
          >
            Kirim Penawaran Lain
          </button>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-white/8 transition-all duration-200';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2';

  const photoFields = [
    { key: 'depan', label: 'Tampak Depan', icon: 'image_search' },
    { key: 'belakang', label: 'Tampak Belakang', icon: 'image_search' },
    { key: 'sampingKiri', label: 'Tampak Samping Kiri', icon: 'image_search' },
    { key: 'sampingKanan', label: 'Tampak Samping Kanan', icon: 'image_search' },
    { key: 'stnkBpkb', label: 'Surat STNK + BPKB', icon: 'description' },
  ];

  return (
    <div className="px-8 lg:px-20 py-16">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
            <span className="material-symbols-outlined text-orange-500 text-3xl">sell</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-3">Jual Motor Anda</h1>
          <p className="text-slate-400 max-w-md mx-auto">Form ini sekarang langsung terhubung ke backend request pembelian.</p>
        </div>

        <div className="glass-card rounded-[2rem] p-10 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nama Lengkap *</label>
                <input className={inputClass} name="nama" placeholder="Budi Santoso" required type="text" value={form.nama} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>No. WhatsApp *</label>
                <input className={inputClass} name="wa" placeholder="08xxxxxxxxxx" required type="tel" value={form.wa} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Alamat *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl pointer-events-none">location_on</span>
                <textarea className={`${inputClass} pl-12 resize-none`} name="alamat" placeholder="Jl. Contoh No. 12, Kelurahan, Kecamatan, Kota..." required rows={3} value={form.alamat} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Merk Motor *</label>
                <input className={inputClass} name="merk" placeholder="Honda, Yamaha, dst..." required type="text" value={form.merk} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Tipe Motor *</label>
                <input className={inputClass} name="tipe" placeholder="CBR, Vario, NMAX..." required type="text" value={form.tipe} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Tahun *</label>
                <input className={inputClass} name="tahun" placeholder="2020" required type="number" min="2000" max="2030" value={form.tahun} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Kilometer</label>
                <input className={inputClass} name="kilometer" placeholder="12.000" type="number" min="0" value={form.kilometer} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Harga Permintaan *</label>
              <input className={inputClass} name="harga" placeholder="Rp 0" required type="text" value={form.harga} onChange={handleChange} />
            </div>

            <div>
              <label className={labelClass}>Deskripsi Kondisi</label>
              <textarea className={`${inputClass} resize-none`} name="deskripsi" placeholder="Kondisi mesin, kelengkapan surat, riwayat servis..." rows={4} value={form.deskripsi} onChange={handleChange} />
            </div>

            {/* Photo Upload Section */}
            <div className="border-t border-white/5 pt-6">
              <label className={labelClass}>Foto-Foto Motor * (5 Foto Diperlukan)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photoFields.map(({ key, label, icon }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{label}</label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${draggingField === key ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 hover:border-orange-500/50 hover:bg-white/3'}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingField(key);
                      }}
                      onDragLeave={() => setDraggingField(null)}
                      onDrop={(e) => handleDrop(e, key)}
                      onClick={() => document.getElementById(`file-${key}`).click()}
                    >
                      {previews[key] ? (
                        <div className="relative">
                          <img src={previews[key]} alt={label} className="w-full h-32 object-cover rounded-lg" />
                          <p className="text-slate-400 text-xs mt-2">Klik untuk ganti</p>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-3xl text-slate-500 block mb-2">
                            {icon}
                          </span>
                          <p className="text-slate-400 font-medium text-sm">Upload Foto</p>
                          <p className="text-slate-600 text-xs mt-1">Maks 2MB</p>
                        </>
                      )}
                      <input
                        id={`file-${key}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0], key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitRequest.isPending}
              className="cursor-pointer w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-900/30 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">send</span>
              {submitRequest.isPending ? 'Mengirim...' : 'Kirim Penawaran'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellMotorPage;
