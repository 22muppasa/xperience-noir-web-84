
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
}

interface ChildAssociationRequest {
  id: string;
  parent_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
  children: Child;
}

interface PendingRequestCardProps {
  request: ChildAssociationRequest;
}

const PendingRequestCard = ({ request }: PendingRequestCardProps) => {
  return (
    <Card className="bg-white border-black">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black">
              {request.children.first_name} {request.children.last_name}
            </h3>
            {request.children.date_of_birth && (
              <p className="text-sm text-black">
                Born: {new Date(request.children.date_of_birth).toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-white">
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-black">
              Requested: {new Date(request.requested_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingRequestCard;
