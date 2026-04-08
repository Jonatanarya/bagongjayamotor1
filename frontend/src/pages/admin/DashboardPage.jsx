import AdminLayout from '../../layouts/AdminLayout';

const summaryCards = [
  { label: 'Stok Tersedia', value: '24', sub: '↑ +3 bulan ini', icon: 'two_wheeler', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Terjual Bulan Ini', value: '12', sub: 'unit', icon: 'sell', color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Request Baru', value: '5', sub: 'menunggu review', icon: 'inbox', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Saran Masuk', value: '8', sub: 'belum dibaca', icon: 'forum', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const recentTransactions = [
  { id: 'TRX-001', type: 'Jual', date: '7 Apr 2026', client: 'Budi Santoso', motor: 'Honda CBR 250RR', amount: 'Rp 58.000.000' },
  { id: 'TRX-002', type: 'Beli', date: '6 Apr 2026', client: 'Siti Rahayu', motor: 'Yamaha XSR 155', amount: 'Rp 28.000.000' },
  { id: 'TRX-003', type: 'Jual', date: '5 Apr 2026', client: 'Ahmad Fauzi', motor: 'Kawasaki Ninja ZX25R', amount: 'Rp 110.000.000' },
  { id: 'TRX-004', type: 'Beli', date: '4 Apr 2026', client: 'Dewi Lestari', motor: 'Honda Vario 160', amount: 'Rp 19.000.000' },
];

function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-all">
              <div className={`p-3 rounded-xl shrink-0 ${card.bg}`}>
                <span className={`material-symbols-outlined ${card.color} text-2xl`}>{card.icon}</span>
              </div>
              <div>
                <div className={`text-3xl font-black tracking-tighter ${card.color}`}>{card.value}</div>
                <div className="text-white font-semibold text-sm mt-0.5">{card.label}</div>
                <div className="text-slate-500 text-xs mt-1">{card.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">Transaksi Terakhir</h2>
            <a href="/admin/transaksi" className="text-orange-500 text-sm font-semibold hover:underline">Lihat Semua →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">ID</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Tipe</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Tanggal</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Klien</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Motor</th>
                  <th className="text-right px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((trx) => (
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
                    <td className="px-6 py-4 text-orange-400 font-bold text-right">{trx.amount}</td>
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

export default DashboardPage;
