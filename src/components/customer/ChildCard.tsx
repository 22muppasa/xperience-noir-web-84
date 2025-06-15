
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Heart, CheckCircle } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
}

interface ParentChildRelationship {
  id: string;
  child_id: string;
  relationship_type: string;
  can_view_work: boolean;
  can_receive_notifications: boolean;
  assigned_at: string;
  status: string;
  children: Child;
}

interface ChildCardProps {
  relationship: ParentChildRelationship;
}

const ChildCard = ({ relationship }: ChildCardProps) => {
  return (
    <Card className="bg-white border-black">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-black">
            {relationship.children.first_name} {relationship.children.last_name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600 bg-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {relationship.children.date_of_birth && (
          <div className="flex items-center space-x-2 text-sm text-black">
            <Calendar className="h-4 w-4" />
            <span>{new Date(relationship.children.date_of_birth).toLocaleDateString()}</span>
          </div>
        )}
        
        {relationship.children.emergency_contact_name && (
          <div className="flex items-center space-x-2 text-sm text-black">
            <Phone className="h-4 w-4" />
            <span>{relationship.children.emergency_contact_name}</span>
          </div>
        )}
        
        {relationship.children.medical_notes && (
          <div className="flex items-center space-x-2 text-sm text-black">
            <Heart className="h-4 w-4" />
            <span className="line-clamp-2">{relationship.children.medical_notes}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 pt-2">
          <Badge variant="outline" className="text-xs text-black border-black bg-white">
            {relationship.relationship_type}
          </Badge>
          {relationship.can_view_work && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-white">
              Can view work
            </Badge>
          )}
          {relationship.can_receive_notifications && (
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-600 bg-white">
              Notifications enabled
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-black">
          Associated: {new Date(relationship.assigned_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildCard;
