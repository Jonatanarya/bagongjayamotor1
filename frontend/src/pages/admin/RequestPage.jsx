import AdminLayout from '../../layouts/AdminLayout';

const requests = [
  { id: 'REQ-001', nama: 'Doni Setiawan', wa: '081234567890', merk: 'Honda', tipe: 'Beat', tahun: '2019', harga: 'Rp 8.500.000', tanggal: '7 Apr 2026', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvyN0E9DOHr748WuIcuBshBGI8VYWoR9qRpm42aaxHbdAwbAguD8kHkzkfozcfbBOw0owdjCyBveOwv17udNmISR3B8jCiE9nE8sDmA_AnL9Dn6HFqOMAHlelkcgBrrZt9pvqEPaySdmSPjyBnMwf7ifVELFeslovy8panxEmY0h3CL6Df8GNSHJ0eJSnxjZCr90vBY_HKdpUuMfdBLpyEkvd6jvrlnZXCdQuc0anqLqPzFZTPNkePzgRb3XE5Hn0FZbT3riUVlQE' },
  { id: 'REQ-002', nama: 'Lisa Permata', wa: '089876543210', merk: 'Yamaha', tipe: 'Mio M3', tahun: '2020', harga: 'Rp 10.000.000', tanggal: '6 Apr 2026', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH2OO94QCk_llhMsoLkheQs-ZO8ZHUDFh70q7q-GfkR13F7Awn7JMOx1CrsvDhcXsQ6fCxPai_Wck3MGlV0_aL-VOW4faBCSOeKu0wfqi-J4HfIaVgI3q7aCDNmUDBctHcs3GZSM8B1k_6IO1GKWk_Wcfx9FkUS3MtA9M5ppJn9GxzVpIttsbrO8TS1U0PD3aItmIndBkowI-3FzSKGMsmlOOz_y2HESGbqA_pLpNA8AJogyMH0uPZEGNzNbhD7gKbFvpYJ0o65VPr' },
  { id: 'REQ-003', nama: 'Rahman Hakim', wa: '082345678901', merk: 'Suzuki', tipe: 'GSX-S150', tahun: '2021', harga: 'Rp 18.000.000', tanggal: '5 Apr 2026', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHPBktpzyfgQkfmuZ2e3oQiCvPXsOUF5FPtcoPlUe-ehK5zKNJSLHiLBjGtt-rw3lxDwKJnlTYoU-Ahusyqcz9modLJ9Nsq0f5oXglLpOrwFlb-3YNCjMMIniqvRXAfhvouSVret8XdiROG4qvQW1skzIgmkkm7nvQsIf-h8sCj8_mbe_Bt1oNfbZasAHPFRC4IbhStocu-PBSkP7KhvCNdUwa8mdtbzyyQEdiWQd9EPsdeIKJx2LtwQFJ9aWEDKlUENfmg3IwzbFS' },
];

function RequestPage() {
  const openWA = (wa) => window.open(`https://wa.me/62${wa.slice(1)}`, '_blank');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-white font-bold text-xl">Request Pembelian</h2>
          <p className="text-slate-400 text-sm">{requests.length} penawaran masuk dari pelanggan</p>
        </div>

        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  {['ID', 'Foto', 'Pengirim', 'No. WA', 'Motor', 'Tahun', 'Harga', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">{req.id}</td>
                    <td className="px-5 py-4">
                      <img src={req.img} alt={req.tipe} className="w-14 h-10 object-cover rounded-lg" />
                    </td>
                    <td className="px-5 py-4 text-white font-medium">{req.nama}</td>
                    <td className="px-5 py-4 text-slate-300 font-mono text-xs">{req.wa}</td>
                    <td className="px-5 py-4 text-slate-300">{req.merk} {req.tipe}</td>
                    <td className="px-5 py-4 text-slate-300">{req.tahun}</td>
                    <td className="px-5 py-4 text-orange-400 font-bold">{req.harga}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{req.tanggal}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => openWA(req.wa)} className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all">
                        <span className="material-symbols-outlined text-sm">chat</span>
                        WA
                      </button>
                    </td>
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

export default RequestPage;
