import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { apiClient } from '../services/apiClient.js';

const createEmptyForm = () => ({
  type: 'Jual',
  date: new Date().toISOString().slice(0, 10),
  clientName: '',
  clientWa: '',
  motorId: '',
  // Field khusus tipe Beli — motor baru yang belum ada di stok
  isNewMotor: false,
  newMotorMerk: '',
  newMotorTipe: '',
  newMotorWarna: '',
  newMotorTahun: '',
  amount: '',
  notes: '',
});

const formatRp = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

function TransactionPage() {
  const queryClient = useQueryClient();
  const receiptRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm());
  const [printTrx, setPrintTrx] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions');
      return response?.data ?? [];
    },
  });

  const { data: motors = [] } = useQuery({
    queryKey: ['motors', 'transaction-options'],
    queryFn: async () => {
      const response = await apiClient.get('/motors?limit=200');
      return response?.data?.motors ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => apiClient.post('/transactions', payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['motors'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
      setModalOpen(false);
      setForm(createEmptyForm());
      setFormErrors({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => apiClient.delete(`/transactions/${id}`),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
      setDeleteItem(null);
    },
  });

  const [formErrors, setFormErrors] = useState({});

  const getMotorLabel = (motorId) => {
    const motor = motors.find((item) => item.id === motorId);
    if (!motor) return motorId || '-';
    const warnaText = motor.warna ? ` - ${motor.warna}` : '';
    return `${motor.merk} ${motor.tipe} ${motor.tahun}${warnaText}`;
  };

  // Motor tersedia = Tersedia untuk transaksi Jual; semua motor untuk referensi Beli
  const availableMotors = form.type === 'Jual'
    ? motors.filter((m) => m.status === 'Tersedia')
    : motors;

  const handleAdd = async () => {
    const errors = {};
    if (!form.date) errors.date = 'Tanggal wajib diisi';
    if (!form.clientName.trim()) errors.clientName = form.type === 'Jual' ? 'Nama pembeli wajib diisi' : 'Nama penjual wajib diisi';
    if (!form.amount) errors.amount = 'Nominal wajib diisi';
    // Validasi motor: jika Jual, wajib pilih motor di stok; jika Beli+newMotor, wajib isi merk+tipe
    if (form.type === 'Jual' && !form.motorId) errors.motorId = 'Pilih motor yang dijual';
    if (form.type === 'Beli' && !form.isNewMotor && !form.motorId) errors.motorId = 'Pilih motor atau centang "Motor Baru"';
    if (form.type === 'Beli' && form.isNewMotor && !form.newMotorMerk.trim()) errors.newMotorMerk = 'Merk wajib diisi';
    if (form.type === 'Beli' && form.isNewMotor && !form.newMotorTipe.trim()) errors.newMotorTipe = 'Tipe wajib diisi';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const motorNotes = form.isNewMotor && form.type === 'Beli'
      ? `[Motor Baru: ${form.newMotorMerk.trim()} ${form.newMotorTipe.trim()}${form.newMotorWarna ? ' - ' + form.newMotorWarna : ''}${form.newMotorTahun ? ' (' + form.newMotorTahun + ')' : ''}]`
      : null;

    await createMutation.mutateAsync({
      type: form.type,
      date: form.date,
      clientName: form.clientName.trim(),
      clientWa: form.clientWa.trim() || null,
      motorId: form.isNewMotor ? null : (form.motorId || null),
      amount: Number(form.amount),
      notes: [motorNotes, form.notes.trim()].filter(Boolean).join(' | ') || null,
    });
  };

  const handlePrint = (transaction) => {
    setPrintTrx(transaction);
    setTimeout(() => window.print(), 300);
  };

  const inputClass =
    'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all text-sm';

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
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-white font-bold text-xl">Manajemen Transaksi</h2>
            <p className="text-slate-400 text-sm">{transactions.length} total transaksi tersimpan</p>
          </div>
          <button
            onClick={() => {
              setForm(createEmptyForm());
              setModalOpen(true);
            }}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Transaksi
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            Gagal memuat transaksi: {error.message}
          </div>
        )}

        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Tipe', 'Tanggal', 'Klien', 'Motor', 'Nominal', 'Aksi'].map((heading) => (
                    <th
                      key={heading}
                      className={`px-6 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs ${
                        heading === 'Aksi' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Memuat transaksi...
                    </td>
                  </tr>
                )}

                {!isLoading && transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{trx.id}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            trx.type === 'Jual' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'
                          }`}
                        >
                          {trx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{trx.date}</td>
                      <td className="px-6 py-4 text-white font-medium">{trx.clientName}</td>
                      <td className="px-6 py-4 text-slate-300">{getMotorLabel(trx.motorId)}</td>
                      <td className="px-6 py-4 text-orange-400 font-bold">{formatRp(trx.amount)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
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
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5"
                          >
                            <span className="material-symbols-outlined text-sm">print</span>
                            Kwitansi
                          </button>
                          <button
                            onClick={() => setDeleteItem(trx)}
                            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-6">
              {form.type === 'Jual' ? 'Tambah Transaksi Jual' : 'Tambah Transaksi Beli'}
            </h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tipe</label>
                <div className="flex gap-3">
                  {['Jual', 'Beli'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((previous) => ({ ...previous, type }))}
                      className={`cursor-pointer flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                        form.type === type
                          ? type === 'Jual'
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tanggal</label>
                <input
                  className={inputClass}
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {form.type === 'Jual' ? 'Nama Pembeli' : 'Nama Penjual'}
                </label>
                <input
                  className={`${inputClass}${formErrors.clientName ? ' border-red-500' : ''}`}
                  placeholder={form.type === 'Jual' ? 'Nama lengkap pembeli...' : 'Nama lengkap penjual...'}
                  value={form.clientName}
                  onChange={(event) => setForm((previous) => ({ ...previous, clientName: event.target.value }))}
                />
                {formErrors.clientName && <p className="text-xs text-red-400 mt-1">{formErrors.clientName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">No. WhatsApp</label>
                <input
                  className={inputClass}
                  placeholder="08xxxxxxxxxx"
                  value={form.clientWa}
                  onChange={(event) => setForm((previous) => ({ ...previous, clientWa: event.target.value }))}
                />
              </div>

              {/* Motor selector — adaptif berdasarkan tipe transaksi */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                    {form.type === 'Jual' ? 'Motor Dijual' : 'Motor Dibeli'}
                  </label>
                  {form.type === 'Beli' && (
                    <label className="flex items-center gap-1.5 text-xs text-blue-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isNewMotor}
                        onChange={(e) => setForm((prev) => ({ ...prev, isNewMotor: e.target.checked, motorId: '' }))}
                        className="accent-blue-500"
                      />
                      Motor Baru (belum di stok)
                    </label>
                  )}
                </div>

                {form.isNewMotor && form.type === 'Beli' ? (
                  <div className="space-y-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-blue-400">Isi detail motor yang akan dibeli dan ditambahkan ke stok:</p>
                    <input
                      className={`${inputClass}${formErrors.newMotorMerk ? ' border-red-500' : ''}`}
                      placeholder="Merk (Honda, Yamaha...)"
                      value={form.newMotorMerk}
                      onChange={(e) => setForm((prev) => ({ ...prev, newMotorMerk: e.target.value }))}
                    />
                    {formErrors.newMotorMerk && <p className="text-xs text-red-400">{formErrors.newMotorMerk}</p>}
                    <input
                      className={`${inputClass}${formErrors.newMotorTipe ? ' border-red-500' : ''}`}
                      placeholder="Tipe (Vario 125, Beat...)"
                      value={form.newMotorTipe}
                      onChange={(e) => setForm((prev) => ({ ...prev, newMotorTipe: e.target.value }))}
                    />
                    {formErrors.newMotorTipe && <p className="text-xs text-red-400">{formErrors.newMotorTipe}</p>}
                    <input
                      className={inputClass}
                      placeholder="Warna (Merah, Hitam...)"
                      value={form.newMotorWarna}
                      onChange={(e) => setForm((prev) => ({ ...prev, newMotorWarna: e.target.value }))}
                    />
                    <input
                      className={inputClass}
                      type="number"
                      placeholder="Tahun (2020)"
                      value={form.newMotorTahun}
                      onChange={(e) => setForm((prev) => ({ ...prev, newMotorTahun: e.target.value }))}
                    />
                    <p className="text-xs text-slate-500">💡 Tambahkan motor ke halaman Stok setelah transaksi berhasil.</p>
                  </div>
                ) : (
                  <>
                    <select
                      className={`${inputClass}${formErrors.motorId ? ' border-red-500' : ''}`}
                      value={form.motorId}
                      onChange={(event) => setForm((previous) => ({ ...previous, motorId: event.target.value }))}
                    >
                      <option value="">Pilih motor...</option>
                      {availableMotors.map((motor) => (
                        <option key={motor.id} value={motor.id}>
                          {motor.merk} {motor.tipe} {motor.tahun}{motor.warna ? ` - ${motor.warna}` : ''} ({motor.id})
                          {motor.status === 'Terjual' ? ' [TERJUAL]' : ''}
                        </option>
                      ))}
                    </select>
                    {formErrors.motorId && <p className="text-xs text-red-400 mt-1">{formErrors.motorId}</p>}
                    {form.type === 'Jual' && availableMotors.length === 0 && (
                      <p className="text-xs text-yellow-400 mt-1">⚠️ Tidak ada motor tersedia di stok.</p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {form.type === 'Jual' ? 'Nominal Penjualan (Rp)' : 'Nominal Pembelian (Rp)'}
                </label>
                <input
                  className={`${inputClass}${formErrors.amount ? ' border-red-500' : ''}`}
                  type="number"
                  placeholder="50000000"
                  value={form.amount}
                  onChange={(event) => setForm((previous) => ({ ...previous, amount: event.target.value }))}
                />
                {formErrors.amount && <p className="text-xs text-red-400 mt-1">{formErrors.amount}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Catatan</label>
                <textarea
                  className={`${inputClass} min-h-24 resize-none`}
                  placeholder="Opsional"
                  value={form.notes}
                  onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))}
                />
              </div>
            </div>

            {createMutation.error && (
              <p className="mt-4 text-sm text-red-300">Gagal menyimpan transaksi: {createMutation.error.message}</p>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="cursor-pointer flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                disabled={createMutation.isPending}
                className="cursor-pointer flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all"
              >
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">delete_forever</span>
            <h3 className="text-white font-bold text-xl mb-2">Hapus Transaksi?</h3>
            <p className="text-slate-400 text-sm mb-3">
              {deleteItem.id} untuk {deleteItem.clientName} akan dihapus permanen.
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

export default TransactionPage;
