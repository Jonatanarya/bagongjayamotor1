import React from 'react';

function LoginPage() {
  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Luxury motorcycle in a modern showroom" 
          className="w-full h-full object-cover filter brightness-[0.2] contrast-125 scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8ACZt7QWUUX0ZyHz_xKOUolHFowSjaYYmKhEDqNutOJKc6VsOb7Amzk2eMQKHbdN9rCe8qBrZS2RKRVlV-BJhhIBXqnMj93nYp1FnI8Afx4kvyE5rbvgWS3LGAIzFLrm5EiucMx4WtjcsoH88bazhR-0ZXtplWxT_bJaYH5cuQE22DK5TxO96bPY8wEno3TRRFbLulpAnY-uxjB2_ldYaeC1T-dDEZdZjrUhRdmw-3NpQDHvtTSyxfXimRFFMj3pbLgxAabJvdh_p"
        />
      </div>

      {/* Asymmetric Branding Element (The Kinetic Silhouette) */}
      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[40rem] text-on-surface-variant absolute -right-20 top-1/2 -translate-y-1/2 rotate-12" data-icon="motorcycle">motorcycle</span>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-10 rounded-xl shadow-[0px_12px_32px_rgba(13,28,47,0.06)] border border-white/20">
          
          {/* Branding Header */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-4xl font-bold" data-icon="settings_input_component">settings_input_component</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-on-surface uppercase italic">
              Bagong Jaya
            </h1>
            <p className="text-on-surface-variant font-medium tracking-wide mt-1 uppercase text-xs">
              Panel Admin
            </p>
          </header>

          {/* Login Form */}
          <form action="#" className="space-y-6" method="POST">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="person">person</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none" 
                  id="username" 
                  name="username" 
                  placeholder="Masukkan username admin" 
                  required 
                  type="text" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" data-icon="lock">lock</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password" 
                />
                <button className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button className="cursor-pointer kinetic-gradient w-full py-4 text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight" type="submit">
              Masuk
            </button>
          </form>

          {/* Footer Links */}
          <footer className="mt-8 text-center">
            <a className="inline-flex items-center gap-2 text-tertiary font-semibold text-sm hover:underline hover:underline-offset-4 decoration-2 transition-all" href="/">
              <span className="material-symbols-outlined text-lg" data-icon="arrow_back">arrow_back</span>
              Kembali ke Beranda
            </a>
          </footer>

        </div>

        {/* System Message / Hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-surface-container-highest/60 text-[0.7rem] uppercase tracking-[0.2em] font-bold">
          <span className="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span>
          Secure Access Channel v2.0
        </div>
      </main>

      {/* Visual Accents */}
      <div className="absolute bottom-10 left-10 opacity-20 flex flex-col gap-1 hidden md:flex">
        <div className="h-1 w-24 bg-primary"></div>
        <div className="h-1 w-16 bg-primary"></div>
        <div className="h-1 w-8 bg-primary"></div>
      </div>
    </div>
  );
}

export default LoginPage;
