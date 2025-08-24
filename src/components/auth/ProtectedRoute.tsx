
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, XCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userRole, approvalStatus } = useAuth();
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
    const getStatusMessage = () => {
      switch (approvalStatus) {
        case 'pending':
          return {
            icon: Clock,
            title: "Account Pending Approval",
            message: "Your admin account is awaiting approval from a system administrator.",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-300"
          };
        case 'rejected':
          return {
            icon: XCircle,
            title: "Account Access Denied",
            message: "Your admin account request has been declined. Please contact support for assistance.",
            color: "text-red-600",
            bgColor: "bg-red-50", 
            borderColor: "border-red-300"
          };
        default:
          return {
            icon: XCircle,
            title: "Access Denied",
            message: "You don't have permission to access this page.",
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-300"
          };
      }
    };

    const status = getStatusMessage();
    const StatusIcon = status.icon;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className={`max-w-md mx-auto text-center p-8 rounded-lg border-2 ${status.bgColor} ${status.borderColor}`}>
          <StatusIcon className={`h-16 w-16 mx-auto mb-4 ${status.color}`} />
          <h1 className={`text-2xl font-bold mb-4 ${status.color}`}>{status.title}</h1>
          <p className={`text-lg mb-6 ${status.color}`}>{status.message}</p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            
            <a 
              href="/" 
              className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </a>
          </div>

          {/* Debug info for development */}
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-left">
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> {userRole || 'None'}</div>
            <div><strong>Approval:</strong> {approvalStatus || 'Unknown'}</div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
