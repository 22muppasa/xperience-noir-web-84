
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';

const DashboardLayout = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your profile...</h2>
          <p className="text-gray-600">Please wait while we set up your dashboard.</p>
        </div>
      </div>
    );
  }

  return profile.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />;
};

export default DashboardLayout;
