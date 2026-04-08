import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authClient } from '../services/authClient.js';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authClient.signIn.email({ body: form });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Luxury motorcycle in a modern showroom"
          className="w-full h-full object-cover brightness-[0.2] contrast-125 scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ACZt7QWUUX0ZyHz_xKOUolHFowSjaYYmKhEDqNutOJKc6VsOb7Amzk2eMQKHbdN9rCe8qBrZS2RKRVlV-BJhhIBXqnMj93nYp1FnI8Afx4kvyE5rbvgWS3LGAIzFLrm5EiucMx4WtjcsoH88bazhR-0ZXtplWxT_bJaYH5cuQE22DK5TxO96bPY8wEno3TRRFbLulpAnY-uxjB2_ldYaeC1T-dDEZdZjrUhRdmw-3NpQDHvtTSyxfXimRFFMj3pbLgxAabJvdh_p"
        />
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[40rem] text-on-surface-variant absolute -right-20 top-1/2 -translate-y-1/2 rotate-12">motorcycle</span>
      </div>

      <main className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-10 rounded-xl shadow-[0px_12px_32px_rgba(13,28,47,0.06)] border border-white/20">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-4xl font-bold">settings_input_component</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-on-surface uppercase italic">
              Bagong Jaya
            </h1>
            <p className="text-on-surface-variant font-medium tracking-wide mt-1 uppercase text-xs">Panel Admin</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">email</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none"
                  id="email"
                  name="email"
                  placeholder="Masukkan email admin"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none"
                  id="password"
                  name="password"
                  placeholder="Masukkan password"
                  required
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                >
                  <span className="material-symbols-outlined text-xl">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              className="cursor-pointer kinetic-gradient w-full py-4 text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>

          <footer className="mt-8 text-center text-sm text-slate-300">
            Login default pengembangan: `admin@bagongjaya.com` / `admin123`
          </footer>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
