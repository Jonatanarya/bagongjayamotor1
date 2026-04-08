import { useState } from 'react';
import { useSubmitSuggestion } from '../../hooks/useSubmitSuggestion.js';

function SuggestionPage() {
  const [form, setForm] = useState({ nama: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);
  const submitSuggestion = useSubmitSuggestion({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ nama: '', pesan: '' });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan.');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitSuggestion.mutate({ nama: form.nama, pesan: form.pesan });
  };

  const inputClass = "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-white/8 transition-all duration-200";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2";

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-8">
        <div className="glass-card rounded-[2rem] p-16 text-center max-w-md border border-green-500/20">
          <span className="material-symbols-outlined text-6xl text-green-500 block mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>mark_chat_read</span>
          <h2 className="text-3xl font-black italic tracking-tighter mb-3">Terima Kasih!</h2>
          <p className="text-slate-400 mb-8">Saran Anda sangat berarti bagi kami untuk terus berkembang.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ nama: '', pesan: '' }); }}
            className="cursor-pointer px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
          >
            Kirim Saran Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 lg:px-20 py-16">
      <div className="container mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
            <span className="material-symbols-outlined text-orange-500 text-3xl">forum</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-3">Berikan Saran Anda</h1>
          <p className="text-slate-400 max-w-md mx-auto">Masukan Anda sangat berarti untuk meningkatkan kualitas layanan kami.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-[2rem] p-10 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className={labelClass}>Nama Anda</label>
              <input
                className={inputClass}
                name="nama"
                placeholder="Nama (opsional)"
                type="text"
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              />
            </div>

            {/* Pesan */}
            <div>
              <label className={labelClass}>Pesan / Saran *</label>
              <textarea
                className={`${inputClass} resize-none`}
                name="pesan"
                placeholder="Tulis saran, masukan, atau kritik membangun untuk kami..."
                required
                rows={6}
                value={form.pesan}
                onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
              />
              <p className="text-slate-600 text-xs mt-1 text-right">{form.pesan.length} karakter</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitSuggestion.isPending}
              className={`cursor-pointer w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl transition-all active:scale-95 shadow-xl shadow-orange-900/30 flex items-center justify-center gap-3 ${submitSuggestion.isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined">send</span>
              {submitSuggestion.isPending ? 'Mengirim...' : 'Kirim Saran'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SuggestionPage;
