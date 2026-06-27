import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/public/Portfolio';
import ProtectedRoute from './components/ProtectedRoute';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const PageLoader = () => (
  <div className="min-h-screen bg-brand-bg flex items-center justify-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-brand-border opacity-20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-cyan animate-spin"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<Portfolio />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
