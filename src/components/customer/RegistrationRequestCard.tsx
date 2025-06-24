
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface RegistrationRequest {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
}

interface RegistrationRequestCardProps {
  request: RegistrationRequest;
}

const RegistrationRequestCard = ({ request }: RegistrationRequestCardProps) => {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'approved':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'pending':
        return 'text-yellow-600 border-yellow-600 bg-white';
      case 'approved':
        return 'text-green-600 border-green-600 bg-white';
      case 'rejected':
        return 'text-red-600 border-red-600 bg-white';
      default:
        return 'text-gray-600 border-gray-600 bg-white';
    }
  };

  return (
    <Card className="bg-white border-black">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black">
              {request.first_name} {request.last_name}
            </h3>
            {request.date_of_birth && (
              <p className="text-sm text-black">
                Born: {new Date(request.date_of_birth).toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusIcon()}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
            {request.notes && request.status === 'rejected' && (
              <p className="text-sm text-red-600 mt-2">
                <strong>Note:</strong> {request.notes}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-black">
              Requested: {new Date(request.requested_at).toLocaleDateString()}
            </p>
            {request.reviewed_at && (
              <p className="text-xs text-black">
                Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationRequestCard;
