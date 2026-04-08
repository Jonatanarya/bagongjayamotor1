import { useState, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const initialTransactions = [
  { id: 'TRX-001', type: 'Jual', date: '2026-04-07', client: 'Budi Santoso', motor: 'Honda CBR 250RR', amount: 58000000 },
  { id: 'TRX-002', type: 'Beli', date: '2026-04-06', client: 'Siti Rahayu', motor: 'Yamaha XSR 155', amount: 28000000 },
  { id: 'TRX-003', type: 'Jual', date: '2026-04-05', client: 'Ahmad Fauzi', motor: 'Kawasaki Ninja ZX25R', amount: 110000000 },
  { id: 'TRX-004', type: 'Beli', date: '2026-04-04', client: 'Dewi Lestari', motor: 'Honda Vario 160', amount: 19000000 },
];

const emptyForm = { type: 'Jual', date: '', client: '', motor: '', amount: '' };

const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

function TransactionPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [printTrx, setPrintTrx] = useState(null);
  const receiptRef = useRef();

  const handleAdd = () => {
    if (!form.date || !form.client || !form.motor || !form.amount) return;
    const newId = `TRX-${String(transactions.length + 1).padStart(3, '0')}`;
    setTransactions((prev) => [...prev, { id: newId, ...form, amount: Number(form.amount.replace(/\D/g, '')) }]);
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handlePrint = (trx) => {
    setPrintTrx(trx);
    setTimeout(() => window.print(), 300);
  };

  const inputClass = "w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all text-sm";

  return (
    <AdminLayout>
      <style>{`
        @media print {
          body > *:not(#receipt-print) { display: none !important; }
          #receipt-print { display: block !important; }
        }
      `}</style>

      {/* Hidden Receipt for Print */}
      <div id="receipt-print" style={{ display: 'none' }} ref={receiptRef}>
        {printTrx && (
          <div style={{ fontFamily: 'Times New Roman, serif', padding: '40px', maxWidth: '500px', margin: '0 auto', color: '#000' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>KWITANSI</h1>
              <h2 style={{ fontSize: '18px', margin: '4px 0' }}>BAGONG JAYA MOTOR</h2>
              <p style={{ fontSize: '12px', margin: 0 }}>Jl. Contoh No. 123, Kota XYZ</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr><td style={{ width: '40%', padding: '6px 0' }}>No. Kwitansi</td><td>: {printTrx.id}</td></tr>
                <tr><td style={{ padding: '6px 0' }}>Tanggal</td><td>: {printTrx.date}</td></tr>
                <tr><td style={{ padding: '6px 0' }}>Nama Klien</td><td>: {printTrx.client}</td></tr>
                <tr><td style={{ padding: '6px 0' }}>Motor</td><td>: {printTrx.motor}</td></tr>
                <tr><td style={{ padding: '6px 0' }}>Nominal</td><td>: {formatRp(printTrx.amount)}</td></tr>
                <tr><td style={{ padding: '6px 0' }}>Tipe</td><td>: Transaksi {printTrx.type}</td></tr>
              </tbody>
            </table>
            <div style={{ borderTop: '1px solid #ccc', marginTop: '32px', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', marginBottom: '60px' }}>Hormat kami,</p>
                <p style={{ fontSize: '14px', borderTop: '1px solid #000', paddingTop: '4px' }}>Admin</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Manajemen Transaksi</h2>
            <p className="text-slate-400 text-sm">{transactions.length} total transaksi</p>
          </div>
          <button onClick={() => { setForm(emptyForm); setModalOpen(true); }} className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Transaksi
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Tipe', 'Tanggal', 'Klien', 'Motor', 'Nominal', 'Aksi'].map((h) => (
                    <th key={h} className={`px-6 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs ${h === 'Aksi' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{trx.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${trx.type === 'Jual' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{trx.date}</td>
                    <td className="px-6 py-4 text-white font-medium">{trx.client}</td>
                    <td className="px-6 py-4 text-slate-300">{trx.motor}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{formatRp(trx.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handlePrint(trx)} className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5">
                          <span className="material-symbols-outlined text-sm">print</span>
                          Kwitansi
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

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-6">Tambah Transaksi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tipe</label>
                <div className="flex gap-3">
                  {['Jual', 'Beli'].map((t) => (
                    <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, type: t }))} className={`cursor-pointer flex-1 py-3 rounded-xl font-bold text-sm transition-all ${form.type === t ? (t === 'Jual' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white') : 'bg-slate-700 text-slate-400 hover:text-white'}`}>{t}</button>
                  ))}
                </div>
              </div>
              {[
                { label: 'Tanggal', name: 'date', type: 'date', placeholder: '' },
                { label: 'Nama Klien', name: 'client', type: 'text', placeholder: 'Nama lengkap...' },
                { label: 'Motor', name: 'motor', type: 'text', placeholder: 'Merk & tipe motor...' },
                { label: 'Nominal (Rp)', name: 'amount', type: 'number', placeholder: '50000000' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                  <input className={inputClass} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalOpen(false)} className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">Batal</button>
              <button onClick={handleAdd} className="cursor-pointer flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default TransactionPage;
