import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A] text-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
