
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black z-50">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = userRole === 'admin' ? '/admin' : '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
