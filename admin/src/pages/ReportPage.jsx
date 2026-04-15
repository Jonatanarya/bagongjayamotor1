import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient.js';

const formatRp = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
const MONTHS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

function ReportPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(currentDate.getFullYear()));

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', 'report'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions');
      return response?.data ?? [];
    },
  });

  const { data: motors = [] } = useQuery({
    queryKey: ['motors', 'report'],
    queryFn: async () => {
      const response = await apiClient.get('/motors?limit=100');
      return response?.data?.motors ?? [];
    },
  });

  const getMotorLabel = (motorId) => {
    const motor = motors.find((item) => item.id === motorId);
    return motor ? `${motor.merk} ${motor.tipe}` : motorId || '-';
  };

  const reportData = transactions.map((item) => {
    const dateValue = new Date(item.date);
    const motorRecord = motors.find((motor) => motor.id === item.motorId);
    const costPrice = motorRecord?.harga ?? 0;
    const salePrice = item.type === 'Jual' ? Number(item.amount || 0) : '';
    const buyPrice = item.type === 'Beli' ? Number(item.amount || 0) : item.type === 'Jual' ? costPrice : '';
    const profit = item.type === 'Jual' ? Number(item.amount || 0) - costPrice : '';

    return {
      ...item,
      month: String(dateValue.getMonth() + 1).padStart(2, '0'),
      year: String(dateValue.getFullYear()),
      client: item.clientName,
      motor: getMotorLabel(item.motorId),
      costPrice,
      sellPrice: salePrice,
      buyPrice,
      rowProfit: profit,
    };
  });

  const yearOptions = Array.from(new Set([String(currentDate.getFullYear()), ...reportData.map((item) => item.year)])).sort(
    (left, right) => Number(right) - Number(left),
  );

  const filtered = reportData.filter((item) => item.month === month && item.year === year);
  const saleTransactions = filtered.filter((item) => item.type === 'Jual');
  const purchaseTransactions = filtered.filter((item) => item.type === 'Beli');
  const totalJual = saleTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBeli = purchaseTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const selisih = totalJual - totalBeli;

  const formatOptionalRp = (value) => {
    if (value === '' || value === null || value === undefined) return '-';
    return formatRp(value);
  };

  const renderTransactionsTable = (title, data, showProfit) => (
    <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5 bg-slate-900/70">
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-slate-400 text-sm mt-1">{data.length} transaksi untuk periode ini</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/50 border-b border-white/5">
              {['ID', 'Tanggal', 'Klien', 'Motor', 'Harga Beli', 'Harga Jual', ...(showProfit ? ['Profit'] : [])].map((heading) => (
                <th key={heading} className="px-6 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-xs">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={showProfit ? 7 : 6} className="text-center py-12 text-slate-500">
                  Memuat data laporan...
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={showProfit ? 7 : 6} className="text-center py-12 text-slate-500">
                  Tidak ada transaksi di sini
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((item) => (
                <tr key={item.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.id}</td>
                  <td className="px-6 py-4 text-slate-300">{item.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{item.client}</td>
                  <td className="px-6 py-4 text-slate-300">{item.motor}</td>
                  <td className="px-6 py-4 text-slate-200">{formatOptionalRp(item.buyPrice)}</td>
                  <td className="px-6 py-4 text-slate-200">{formatOptionalRp(item.sellPrice)}</td>
                  {showProfit && (
                    <td className={`px-6 py-4 font-bold ${item.rowProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.rowProfit === '' ? '-' : formatRp(item.rowProfit)}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleExport = () => {
    const header = 'ID,Tipe,Tanggal,Klien,Motor,Harga Beli,Harga Jual,Profit\n';
    const rows = filtered
      .map((item) => [
        item.id,
        item.type,
        item.date,
        item.client,
        item.motor,
        item.buyPrice !== '' ? item.buyPrice : '',
        item.sellPrice !== '' ? item.sellPrice : '',
        item.rowProfit !== '' ? item.rowProfit : '',
      ].join(','))
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `laporan-${year}-${month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const selectClass =
    'bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-all cursor-pointer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-white font-bold text-xl">Laporan Transaksi</h2>
          <p className="text-slate-400 text-sm">Filter berdasarkan bulan & tahun dari transaksi backend</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Download CSV
        </button>
      </div>

      <div className="flex gap-3">
        <select className={selectClass} value={month} onChange={(event) => setMonth(event.target.value)}>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value} className="bg-slate-900">
              {item.label}
            </option>
          ))}
        </select>
        <select className={selectClass} value={year} onChange={(event) => setYear(event.target.value)}>
          {yearOptions.map((item) => (
            <option key={item} value={item} className="bg-slate-900">
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          Gagal memuat laporan transaksi: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Penjualan', value: formatRp(totalJual), color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Pembelian', value: formatRp(totalBeli), color: 'text-blue-400', bg: 'bg-blue-500/10' },
          {
            label: 'Selisih (Profit)',
            value: formatRp(selisih),
            color: selisih >= 0 ? 'text-orange-400' : 'text-red-400',
            bg: selisih >= 0 ? 'bg-orange-500/10' : 'bg-red-500/10',
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border border-white/5 rounded-2xl p-6`}>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{card.label}</div>
            <div className={`text-2xl font-black tracking-tighter ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/50 border-b border-white/5">
                {['ID', 'Tipe', 'Tanggal', 'Klien', 'Motor', 'Harga Beli', 'Harga Jual', 'Profit'].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Memuat data laporan...
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Tidak ada data untuk periode ini
                  </td>
                </tr>
              )}

              {!isLoading &&
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.type === 'Jual' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{item.date}</td>
                    <td className="px-6 py-4 text-white font-medium">{item.client}</td>
                    <td className="px-6 py-4 text-slate-300">{item.motor}</td>
                    <td className="px-6 py-4 text-slate-200">{formatOptionalRp(item.buyPrice)}</td>
                    <td className="px-6 py-4 text-slate-200">{formatOptionalRp(item.sellPrice)}</td>
                    <td className={`px-6 py-4 font-bold ${item.rowProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.rowProfit === '' ? '-' : formatRp(item.rowProfit)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
