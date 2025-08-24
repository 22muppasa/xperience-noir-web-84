
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
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Profile Setup Required</h1>
          <p className="text-gray-600 mb-4">
            There was an issue setting up your profile. This could be due to permissions or your account may need manual approval.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            User ID: {user.id}<br/>
            Email: {user.email}<br/>
            Current role: {userRole || 'Not assigned'}<br/>
            Profile status: {userRole ? 'Found' : 'Missing'}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
            >
              Retry Loading Profile
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Return to Home
            </button>
          </div>
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
