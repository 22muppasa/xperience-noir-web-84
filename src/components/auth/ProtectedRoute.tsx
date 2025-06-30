
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

  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to 404
  // This prevents unwanted redirects during role changes or page refreshes
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
