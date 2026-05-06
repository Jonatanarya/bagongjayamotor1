import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motorService } from '../../services/motorService.js';

const fallbackImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvyN0E9DOHr748WuIcuBshBGI8VYWoR9qRpm42aaxHbdAwbAguD8kHkzkfozcfbBOw0owdjCyBveOwv17udNmISR3B8jCiE9nE8sDmA_AnL9Dn6HFqOMAHlelkcgBrrZt9pvqEPaySdmSPjyBnMwf7ifVELFeslovy8panxEmY0h3CL6Df8GNSHJ0eJSnxjZCr90vBY_HKdpUuMfdBLpyEkvd6jvrlnZXCdQuc0anqLqPzFZTPNkePzgRb3XE5Hn0FZbT3riUVlQE';

const formatPrice = (value) => `Rp ${(Number(value || 0) / 1000000).toLocaleString('id-ID')}jt`;

function mapMotor(motor) {
  return {
    id: motor.id,
    img: motor.imageUrl || fallbackImage,
    name: `${motor.merk} ${motor.tipe}`,
    year: String(motor.tahun),
    km: Number(motor.kilometer || 0).toLocaleString('id-ID'),
    price: formatPrice(motor.harga),
    specs: [
      { icon: 'calendar_month', label: String(motor.tahun) },
      { icon: 'speed', label: `${Number(motor.kilometer || 0).toLocaleString('id-ID')} KM` },
      { icon: 'sell', label: motor.status || 'Tersedia' },
    ],
  };
}

function MotorCard({ motor }) {
  const openWhatsApp = () => {
    const message = encodeURIComponent(`Halo, saya tertarik dengan ${motor.name}. Apakah unit ini masih tersedia?`);
    window.open(`https://wa.me/6288989010342?text=${message}`, '_blank');
  };

  return (
    <div className="group glass-card rounded-[2rem] overflow-hidden flex flex-col hover:border-orange-500/40 transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img alt={motor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={motor.img} />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h4 className="text-2xl font-black tracking-tight text-white group-hover:text-orange-500 transition-colors">{motor.name}</h4>
            <p className="text-slate-500 font-semibold text-sm">Tahun {motor.year} | {motor.km} KM</p>
          </div>
          <div className="text-orange-500 font-black text-2xl tracking-tighter whitespace-nowrap">{motor.price}</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {motor.specs.map((spec) => (
            <div key={spec.label} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
              <span className="material-symbols-outlined text-orange-500 block mb-1 text-xl">{spec.icon}</span>
              <span className="text-[10px] font-bold uppercase text-slate-400">{spec.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={openWhatsApp}
          className="cursor-pointer w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all mt-auto active:scale-95 shadow-lg shadow-green-900/20"
        >
          <span className="material-symbols-outlined">chat</span>
          Hubungi WhatsApp
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const { data: motors = [], isLoading } = useQuery({
    queryKey: ['public', 'motors'],
    queryFn: motorService.getMotors,
  });

  const featuredMotors = motors.slice(0, 3).map(mapMotor);
  const availableCount = motors.filter((motor) => motor.status === 'Tersedia').length;

  return (
    <>
      <section className="relative min-h-[870px] flex items-center px-8 lg:px-20 overflow-hidden hero-gradient">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Dealer Terpercaya Sejak 1998
            </div>
            <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none">
              Temukan Motor Bekas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Berkualitas</span> di Sini
            </h1>
            <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
              Nikmati pengalaman membeli motor bekas rasa baru dengan pilihan unit yang sekarang langsung tersambung ke stok backend.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/katalog"
                className="px-8 py-4 bg-orange-500 rounded-xl font-bold text-white shadow-xl shadow-orange-900/40 flex items-center gap-3 hover:bg-orange-600 transition-all active:scale-95"
              >
                Lihat Stok
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/jual-motor" className="px-8 py-4 glass-card rounded-xl font-bold text-white hover:bg-white/10 transition-all active:scale-95 border border-white/10">
                Jual Motor Anda
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full"></div>
            <div className="relative z-10 scale-110 lg:scale-125 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
              <img alt="Premium Motorcycle" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(249,115,22,0.2)] rounded-2xl object-cover" src={fallbackImage} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-12 px-8">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 shadow-2xl">
          {[
            { val: `${availableCount}+`, label: 'Motor Tersedia', color: 'text-orange-500' },
            { val: `${motors.length}+`, label: 'Total Unit', color: 'text-white' },
            { val: '100%', label: 'Data Live Backend', color: 'text-white' },
            { val: isLoading ? '...' : 'Online', label: 'Status Katalog', color: 'text-white' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <div className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.val}</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 lg:px-20 bg-slate-950/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-orange-500 font-bold uppercase tracking-[0.3em] text-sm mb-4">Katalog Terbaru</h2>
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight">Unit Pilihan Minggu Ini</h3>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-slate-400">Memuat stok motor...</div>
          ) : featuredMotors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMotors.map((motor) => (
                <MotorCard key={motor.id} motor={motor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">Belum ada motor yang tersedia di backend.</div>
          )}

          <div className="mt-16 text-center">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-12 py-5 glass-card rounded-2xl font-bold hover:bg-white/5 transition-all text-orange-500 group border border-orange-500/10"
            >
              Lihat Seluruh Katalog
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">east</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
