
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userRole, isApproved } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - User:', user?.email);
  console.log('ProtectedRoute - Loading:', loading);
  console.log('ProtectedRoute - User Role:', userRole);
  console.log('ProtectedRoute - Is Approved:', isApproved);

  // Show loading screen while authentication is being determined
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black z-50">
        <div className="text-center">
          <Loader />
          <p className="text-white mt-4">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user doesn't have admin role, show access denied
  if (userRole !== 'admin') {
    console.log('ProtectedRoute - User is not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl text-gray-600 mb-4">You don't have permission to access this page</p>
          <p className="text-sm text-gray-500 mb-4">Current role: {userRole || 'No role assigned'}</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // If user is admin but not approved, show pending approval message
  if (userRole === 'admin' && !isApproved) {
    console.log('ProtectedRoute - Admin user not approved, showing pending message');
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

  console.log('ProtectedRoute - All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
