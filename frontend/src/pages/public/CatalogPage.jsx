import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motorService } from '../../services/motorService.js';

const fallbackImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvyN0E9DOHr748WuIcuBshBGI8VYWoR9qRpm42aaxHbdAwbAguD8kHkzkfozcfbBOw0owdjCyBveOwv17udNmISR3B8jCiE9nE8sDmA_AnL9Dn6HFqOMAHlelkcgBrrZt9pvqEPaySdmSPjyBnMwf7ifVELFeslovy8panxEmY0h3CL6Df8GNSHJ0eJSnxjZCr90vBY_HKdpUuMfdBLpyEkvd6jvrlnZXCdQuc0anqLqPzFZTPNkePzgRb3XE5Hn0FZbT3riUVlQE';

const formatPrice = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

function CatalogPage() {
  const [search, setSearch] = useState('');
  const [merk, setMerk] = useState('Semua');
  const [year, setYear] = useState('Semua');
  const [status, setStatus] = useState('Semua');

  const { data: motors = [], isLoading } = useQuery({
    queryKey: ['catalog', 'motors'],
    queryFn: motorService.getMotors,
  });

  const merks = ['Semua', ...new Set(motors.map((motor) => motor.merk))];
  const years = ['Semua', ...new Set(motors.map((motor) => String(motor.tahun)).sort((a, b) => Number(b) - Number(a)))];

  const filtered = motors.filter((motor) => {
    const matchSearch = `${motor.merk} ${motor.tipe}`.toLowerCase().includes(search.toLowerCase());
    const matchMerk = merk === 'Semua' || motor.merk === merk;
    const matchYear = year === 'Semua' || String(motor.tahun) === year;
    const matchStatus = status === 'Semua' || motor.status === status;
    return matchSearch && matchMerk && matchYear && matchStatus;
  });

  const resetFilters = () => {
    setSearch('');
    setMerk('Semua');
    setYear('Semua');
    setStatus('Semua');
  };

  return (
    <div className="px-8 lg:px-20 py-16">
      <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-orange-500 font-bold uppercase tracking-[0.3em] text-sm mb-3">Temukan Motor Impian Anda</h2>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">Katalog Motor</h1>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-10 flex flex-wrap gap-4 items-center border border-white/5">
          <div className="flex items-center bg-white/5 rounded-full px-4 py-2.5 border border-white/10 flex-1 min-w-[200px] focus-within:border-orange-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-sm">search</span>
            <input
              className="bg-transparent border-none focus:outline-none text-sm text-white placeholder-slate-500 w-full"
              placeholder="Cari merk / tipe..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer" value={merk} onChange={(e) => setMerk(e.target.value)}>
            {merks.map((item) => (
              <option key={item} value={item} className="bg-slate-900">
                {item === 'Semua' ? 'Semua Merk' : item}
              </option>
            ))}
          </select>

          <select className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((item) => (
              <option key={item} value={item} className="bg-slate-900">
                {item === 'Semua' ? 'Semua Tahun' : item}
              </option>
            ))}
          </select>

          <select className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer" value={status} onChange={(e) => setStatus(e.target.value)}>
            {['Semua', 'Tersedia', 'Terjual'].map((item) => (
              <option key={item} value={item} className="bg-slate-900">
                {item === 'Semua' ? 'Semua Status' : item}
              </option>
            ))}
          </select>
        </div>

        <p className="text-slate-400 text-sm mb-8">
          {isLoading ? 'Memuat katalog...' : <>Menampilkan <span className="text-orange-500 font-bold">{filtered.length}</span> unit</>}
        </p>

        {isLoading ? (
          <div className="text-center py-24 text-slate-400">Mengambil data motor dari backend...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((motor) => (
              <div key={motor.id} className="group glass-card rounded-[2rem] overflow-hidden flex flex-col hover:border-orange-500/40 transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img alt={`${motor.merk} ${motor.tipe}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={motor.imageUrl || fallbackImage} />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h4 className="text-xl font-black tracking-tight text-white group-hover:text-orange-500 transition-colors">{motor.merk} {motor.tipe}</h4>
                      <p className="text-slate-500 font-semibold text-sm">Tahun {motor.tahun} | {Number(motor.kilometer || 0).toLocaleString('id-ID')} KM</p>
                    </div>
                    <div className="text-orange-500 font-black text-xl tracking-tighter whitespace-nowrap">{formatPrice(motor.harga)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { icon: 'calendar_month', label: String(motor.tahun) },
                      { icon: 'speed', label: `${Number(motor.kilometer || 0).toLocaleString('id-ID')} KM` },
                      { icon: 'sell', label: motor.status || 'Tersedia' },
                    ].map((spec) => (
                      <div key={spec.label} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="material-symbols-outlined text-orange-500 block mb-1 text-xl">{spec.icon}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Halo, saya tertarik dengan ${motor.merk} ${motor.tipe}`)}`, '_blank')}
                    className="cursor-pointer w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all mt-auto active:scale-95"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Hubungi WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-7xl text-slate-700 block mb-4">two_wheeler</span>
            <h3 className="text-2xl font-black text-slate-500 mb-2">Tidak ada motor yang cocok</h3>
            <p className="text-slate-600 mb-8">Coba ubah filter atau kata kunci pencarian Anda.</p>
            <button onClick={resetFilters} className="cursor-pointer px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all">
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
