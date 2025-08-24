
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userRole, isApproved } = useAuth();
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

  // If user doesn't have admin role, show access denied
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl text-gray-600 mb-4">You don't have permission to access this page</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // If user is admin but not approved, show pending approval message
  if (userRole === 'admin' && !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-yellow-600">Account Pending Approval</h1>
          <p className="text-gray-600 mb-4">
            Your admin account is currently pending approval. Please wait for an existing admin to approve your account before you can access the admin dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
