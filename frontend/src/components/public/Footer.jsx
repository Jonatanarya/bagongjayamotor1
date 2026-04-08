function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-12 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-900 pt-12">
        <div>
          <div className="text-xl font-black italic text-white mb-4">
            Bagong Jaya Motor
          </div>
          <p className="text-slate-500 text-xs uppercase tracking-widest leading-loose">
            © 2024 Bagong Jaya Motor. Otoritas Otomotif Indonesia.
          </p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-6">
          <a className="text-xs uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors" href="#">Terms of Service</a>
          <a className="text-xs uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors" href="#">Contact Us</a>
          <a className="text-xs uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors" href="#">Dealer Locations</a>
        </div>
      </div>
      <div className="container mx-auto mt-12 flex justify-between items-center opacity-30 border-t border-white/5 pt-8">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-white">social_leaderboard</span>
          <span className="material-symbols-outlined text-white">retweet</span>
          <span className="material-symbols-outlined text-white">video_youtube</span>
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Built for Speed & Reliability</div>
      </div>
    </footer>
  );
}

export default Footer;
