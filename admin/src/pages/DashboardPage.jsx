import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { apiClient } from '../services/apiClient.js';

const formatRp = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

function DashboardPage() {
  const [printTrx, setPrintTrx] = useState(null);
  const receiptRef = useRef();

  const { data: stockSummary } = useQuery({
    queryKey: ['dashboard', 'stock-summary'],
    queryFn: async () => {
      const response = await apiClient.get('/motors/dashboard/summary');
      return response?.data ?? {};
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['dashboard', 'transactions'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions');
      return response?.data ?? [];
    },
  });

  const { data: motors = [] } = useQuery({
    queryKey: ['dashboard', 'motors'],
    queryFn: async () => {
      const response = await apiClient.get('/motors?limit=100');
      return response?.data?.motors ?? [];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['dashboard', 'requests'],
    queryFn: async () => {
      const response = await apiClient.get('/requests');
      return response?.data ?? [];
    },
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ['dashboard', 'suggestions'],
    queryFn: async () => {
      const response = await apiClient.get('/suggestions');
      return response?.data ?? [];
    },
  });

  const recentTransactions = transactions.slice(0, 4);

  const getMotorLabel = (motorId) => {
    const motor = motors.find((item) => item.id === motorId);
    return motor ? `${motor.merk} ${motor.tipe}` : motorId || '-';
  };

  const summaryCards = [
    {
      label: 'Stok Tersedia',
      value: String(stockSummary?.available ?? 0),
      sub: `${stockSummary?.sold ?? 0} unit sudah terjual`,
      icon: 'two_wheeler',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Terjual',
      value: String(stockSummary?.sold ?? 0),
      sub: `Nilai stok ${formatRp(stockSummary?.total_value ?? 0)}`,
      icon: 'sell',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Request Baru',
      value: String(requests.length),
      sub: 'Penawaran jual motor masuk',
      icon: 'inbox',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Saran Masuk',
      value: String(suggestions.length),
      sub: 'Masukan dari pelanggan',
      icon: 'forum',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const handlePrint = (trx) => {
    setPrintTrx(trx);
    setTimeout(() => window.print(), 300);
  };

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#receipt-print) { display: none !important; }
          #receipt-print { display: block !important; }
        }
      `}</style>

      <div id="receipt-print" style={{ display: 'none' }} ref={receiptRef}>
        <ReceiptTemplate transaction={printTrx} />
      </div>

      <div className="space-y-6">
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

        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">Transaksi Terakhir</h2>
            <Link to="/transaksi" className="text-orange-500 text-sm font-semibold hover:underline">Lihat Semua</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">ID</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Tipe</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Tanggal</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Klien</th>
                  <th className="text-left px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Nominal</th>
                  <th className="text-right px-6 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Aksi</th>
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
                    <td className="px-6 py-4 text-white font-medium">{trx.clientName}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{formatRp(trx.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handlePrint({
                            id: trx.id,
                            type: trx.type,
                            date: trx.date,
                            client: trx.clientName,
                            motor: getMotorLabel(trx.motorId),
                            amount: trx.amount,
                          })
                        }
                        className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5"
                      >
                        <span className="material-symbols-outlined text-sm">print</span>
                        <span>Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
