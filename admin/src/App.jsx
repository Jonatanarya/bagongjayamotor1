import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StockPage from './pages/StockPage';
import TransactionPage from './pages/TransactionPage';
import RequestPage from './pages/RequestPage';
import ReportPage from './pages/ReportPage';
import SuggestionAdminPage from './pages/SuggestionAdminPage';
import AdminManagementPage from './pages/AdminManagementPage';
import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stok" element={<StockPage />} />
            <Route path="/transaksi" element={<TransactionPage />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/laporan" element={<ReportPage />} />
            <Route path="/saran" element={<SuggestionAdminPage />} />
            <Route path="/admin" element={<AdminManagementPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
