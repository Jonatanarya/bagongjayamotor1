import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const allData = [
  { id: 'TRX-001', type: 'Jual', date: '2026-04-07', month: '04', year: '2026', client: 'Budi Santoso', motor: 'Honda CBR 250RR', amount: 58000000 },
  { id: 'TRX-002', type: 'Beli', date: '2026-04-06', month: '04', year: '2026', client: 'Siti Rahayu', motor: 'Yamaha XSR 155', amount: 28000000 },
  { id: 'TRX-003', type: 'Jual', date: '2026-04-05', month: '04', year: '2026', client: 'Ahmad Fauzi', motor: 'Kawasaki Ninja ZX25R', amount: 110000000 },
  { id: 'TRX-004', type: 'Beli', date: '2026-03-28', month: '03', year: '2026', client: 'Dewi Lestari', motor: 'Honda Vario 160', amount: 19000000 },
  { id: 'TRX-005', type: 'Jual', date: '2026-03-20', month: '03', year: '2026', client: 'Rizal Maulana', motor: 'Yamaha NMAX 155', amount: 25000000 },
];

const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
const MONTHS = [
  { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
  { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

function ReportPage() {
  const [month, setMonth] = useState('04');
  const [year, setYear] = useState('2026');

  const filtered = allData.filter((d) => d.month === month && d.year === year);
  const totalJual = filtered.filter((d) => d.type === 'Jual').reduce((s, d) => s + d.amount, 0);
  const totalBeli = filtered.filter((d) => d.type === 'Beli').reduce((s, d) => s + d.amount, 0);
  const selisih = totalJual - totalBeli;

  const handleExport = () => {
    // Simple CSV export fallback (xlsx lib not installed)
    const header = 'ID,Tipe,Tanggal,Klien,Motor,Nominal\n';
    const rows = filtered.map((d) => `${d.id},${d.type},${d.date},${d.client},${d.motor},${d.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${year}-${month}.csv`;
    a.click();
  };

  const selectClass = "bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-all cursor-pointer";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Laporan Transaksi</h2>
            <p className="text-slate-400 text-sm">Filter berdasarkan bulan & tahun</p>
          </div>
          <button onClick={handleExport} className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">download</span>
            Download CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select className={selectClass} value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((m) => <option key={m.value} value={m.value} className="bg-slate-900">{m.label}</option>)}
          </select>
          <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
            {['2024', '2025', '2026'].map((y) => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Penjualan', value: formatRp(totalJual), color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Total Pembelian', value: formatRp(totalBeli), color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Selisih (Profit)', value: formatRp(selisih), color: selisih >= 0 ? 'text-orange-400' : 'text-red-400', bg: selisih >= 0 ? 'bg-orange-500/10' : 'bg-red-500/10' },
          ].map((c) => (
            <div key={c.label} className={`${c.bg} border border-white/5 rounded-2xl p-6`}>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{c.label}</div>
              <div className={`text-2xl font-black tracking-tighter ${c.color}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Tipe', 'Tanggal', 'Klien', 'Motor', 'Nominal'].map((h) => (
                    <th key={h} className={`px-6 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-xs`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Tidak ada data untuk periode ini</td></tr>
                ) : filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{d.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${d.type === 'Jual' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>{d.type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{d.date}</td>
                    <td className="px-6 py-4 text-white font-medium">{d.client}</td>
                    <td className="px-6 py-4 text-slate-300">{d.motor}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{formatRp(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ReportPage;
