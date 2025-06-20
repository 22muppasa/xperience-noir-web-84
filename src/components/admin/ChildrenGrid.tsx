
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Heart, Link, Baby, Trash2 } from 'lucide-react';
import DeleteChildDialog from './DeleteChildDialog';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
  created_at: string;
}

interface ChildrenGridProps {
  children: Child[];
  onLinkParent: (child: Child) => void;
}

const ChildrenGrid = ({ children, onLinkParent }: ChildrenGridProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);

  const handleDeleteClick = (child: Child) => {
    setChildToDelete(child);
    setDeleteDialogOpen(true);
  };

  if (children.length === 0) {
    return (
      <Card className="bg-white border-black">
        <CardContent className="p-12 text-center">
          <Baby className="h-12 w-12 text-black mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">No children found</h3>
          <p className="text-black">Start by creating a child profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="bg-white border-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-black">
                  {child.first_name} {child.last_name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLinkParent(child)}
                    className="border-black text-white hover:bg-gray-50"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(child)}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {child.date_of_birth && (
                <div className="flex items-center space-x-2 text-sm text-black">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(child.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
              
              {child.emergency_contact_name && (
                <div className="flex items-center space-x-2 text-sm text-black">
                  <Phone className="h-4 w-4" />
                  <span>{child.emergency_contact_name}</span>
                </div>
              )}
              
              {child.medical_notes && (
                <div className="flex items-center space-x-2 text-sm text-black">
                  <Heart className="h-4 w-4" />
                  <span className="line-clamp-2">{child.medical_notes}</span>
                </div>
              )}
              
              <div className="text-xs text-black">
                Created: {new Date(child.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteChildDialog
        child={childToDelete}
        isOpen={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setChildToDelete(null);
        }}
      />
    </>
  );
};

export default ChildrenGrid;
