import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authClient } from '../services/authClient.js';

function RequireAuth({ children }) {
  const session = authClient.useSession?.();
  const location = useLocation();

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-10 text-center shadow-2xl shadow-black/20">
          <p className="text-lg font-semibold">Memeriksa status otentikasi...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
}

export default RequireAuth;
