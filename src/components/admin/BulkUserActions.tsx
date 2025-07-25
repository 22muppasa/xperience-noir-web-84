
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Shield, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'customer';
}

interface BulkUserActionsProps {
  selectedUsers: Profile[];
  onClearSelection: () => void;
}

const BulkUserActions = ({ selectedUsers, onClearSelection }: BulkUserActionsProps) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: '', count: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ action, userIds }: { action: string; userIds: string[] }) => {
      switch (action) {
        case 'role_admin':
          await Promise.all(
            userIds.map(id =>
              supabase.from('profiles').update({ role: 'admin' }).eq('id', id)
            )
          );
          break;
        case 'role_customer':
          await Promise.all(
            userIds.map(id =>
              supabase.from('profiles').update({ role: 'customer' }).eq('id', id)
            )
          );
          break;
        case 'send_email':
          // In a real implementation, this would trigger an email service
          console.log('Sending emails to:', userIds);
          break;
        case 'delete':
          await Promise.all(
            userIds.map(id =>
              supabase.from('profiles').delete().eq('id', id)
            )
          );
          break;
        default:
          throw new Error('Invalid action');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Bulk action completed",
        description: `Successfully performed ${variables.action} on ${variables.userIds.length} users`,
      });
      onClearSelection();
      setBulkAction('');
    },
    onError: (error) => {
      console.error('Bulk action error:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      action: bulkAction,
      count: selectedUsers.length
    });
  };

  const confirmBulkAction = () => {
    const userIds = selectedUsers.map(user => user.id);
    bulkUpdateMutation.mutate({ action: bulkAction, userIds });
    setConfirmDialog({ isOpen: false, action: '', count: 0 });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'role_admin': return 'Set as Admin';
      case 'role_customer': return 'Set as Customer';
      case 'send_email': return 'Send Email';
      case 'delete': return 'Delete Users';
      default: return '';
    }
  };

  if (selectedUsers.length === 0) return null;

  return (
    <>
      <div className="bg-white border border-black rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-black" />
              <span className="text-black font-medium">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48 bg-white border-black text-black">
                <SelectValue placeholder="Choose action..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-black">
                <SelectItem value="role_admin" className="text-black">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Set as Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="role_customer" className="text-black">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Set as Customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="send_email" className="text-black">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </div>
                </SelectItem>
                <SelectItem value="delete" className="text-red-600">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Users</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction || bulkUpdateMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {bulkUpdateMutation.isPending ? 'Processing...' : 'Apply Action'}
            </Button>
            <Button
              variant="outline"
              onClick={onClearSelection}
              className="border-black text-black hover:bg-gray-50"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        setConfirmDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <AlertDialogContent className="bg-white border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to {getActionLabel(confirmDialog.action).toLowerCase()} for {confirmDialog.count} user{confirmDialog.count !== 1 ? 's' : ''}?
              {confirmDialog.action === 'delete' && (
                <span className="block mt-2 text-red-600 font-medium">
                  This action cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              className="bg-black text-white hover:bg-gray-800"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkUserActions;
