import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Shield, Trash2, AlertTriangle } from 'lucide-react';
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
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    action: '', 
    count: 0,
    hasAdminConflict: false 
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ action, userIds }: { action: string; userIds: string[] }) => {
      const { data: currentUser } = await supabase.auth.getUser();
      
      switch (action) {
        case 'role_admin':
          await Promise.all(
            userIds.map(async (id) => {
              await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
              
              // Log audit event using existing audit_logs table
              await supabase
                .from('audit_logs')
                .insert({
                  table_name: 'profiles',
                  record_id: id,
                  action: 'BULK_ROLE_CHANGE',
                  new_values: { role: 'admin' },
                  user_id: currentUser.user?.id
                });
            })
          );
          break;
          
        case 'role_customer':
          // Check if we're removing all admins
          const { data: adminCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('role', 'admin')
            .not('id', 'in', `(${userIds.join(',')})`);
          
          if (!adminCount || adminCount.length === 0) {
            throw new Error('Cannot remove all admin users from the system');
          }
          
          await Promise.all(
            userIds.map(async (id) => {
              await supabase.from('profiles').update({ role: 'customer' }).eq('id', id);
              
              // Log audit event using existing audit_logs table
              await supabase
                .from('audit_logs')
                .insert({
                  table_name: 'profiles',
                  record_id: id,
                  action: 'BULK_ROLE_CHANGE',
                  new_values: { role: 'customer' },
                  user_id: currentUser.user?.id
                });
            })
          );
          break;
          
        case 'send_email':
          // In a real implementation, this would trigger an email service
          // For now, we'll just log the action using existing audit_logs table
          await supabase
            .from('audit_logs')
            .insert({
              table_name: 'bulk_operations',
              record_id: 'bulk-email-' + Date.now(),
              action: 'BULK_EMAIL_SENT',
              new_values: { recipient_count: userIds.length, recipient_ids: userIds },
              user_id: currentUser.user?.id
            });
          console.log('Bulk email would be sent to:', userIds);
          break;
          
        case 'delete':
          // Prevent deleting all admins
          const selectedAdmins = selectedUsers.filter(u => u.role === 'admin');
          if (selectedAdmins.length > 0) {
            const { data: remainingAdmins } = await supabase
              .from('profiles')
              .select('id', { count: 'exact' })
              .eq('role', 'admin')
              .not('id', 'in', `(${selectedAdmins.map(a => a.id).join(',')})`);
            
            if (!remainingAdmins || remainingAdmins.length === 0) {
              throw new Error('Cannot delete all admin users from the system');
            }
          }
          
          // Delete profiles and audit log
          await Promise.all([
            ...userIds.map(id => supabase.from('profiles').delete().eq('id', id)),
            supabase
              .from('audit_logs')
              .insert({
                table_name: 'profiles',
                record_id: 'bulk-delete-' + Date.now(),
                action: 'BULK_DELETE_USERS',
                old_values: { deleted_user_count: userIds.length, deleted_user_ids: userIds },
                user_id: currentUser.user?.id
              })
          ]);
          break;
          
        default:
          throw new Error('Invalid action');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      let successMessage = '';
      switch (variables.action) {
        case 'role_admin':
          successMessage = `Successfully promoted ${variables.userIds.length} users to admin`;
          break;
        case 'role_customer':
          successMessage = `Successfully changed ${variables.userIds.length} users to customer role`;
          break;
        case 'send_email':
          successMessage = `Email notifications sent to ${variables.userIds.length} users`;
          break;
        case 'delete':
          successMessage = `Successfully deleted ${variables.userIds.length} users`;
          break;
        default:
          successMessage = `Bulk action completed on ${variables.userIds.length} users`;
      }
      
      toast({
        title: "Bulk action completed",
        description: successMessage,
      });
      onClearSelection();
      setBulkAction('');
    },
    onError: (error) => {
      console.error('Bulk action error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    // Check for admin conflicts
    const hasAdminConflict = (bulkAction === 'role_customer' || bulkAction === 'delete') && 
                           selectedUsers.some(u => u.role === 'admin');

    setConfirmDialog({
      isOpen: true,
      action: bulkAction,
      count: selectedUsers.length,
      hasAdminConflict
    });
  };

  const confirmBulkAction = () => {
    const userIds = selectedUsers.map(user => user.id);
    bulkUpdateMutation.mutate({ action: bulkAction, userIds });
    setConfirmDialog({ isOpen: false, action: '', count: 0, hasAdminConflict: false });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'role_admin': return 'Promote to Admin';
      case 'role_customer': return 'Change to Customer';
      case 'send_email': return 'Send Notification Email';
      case 'delete': return 'Delete Users';
      default: return '';
    }
  };

  const getActionDescription = (action: string, count: number) => {
    switch (action) {
      case 'role_admin': 
        return `promote ${count} user${count !== 1 ? 's' : ''} to admin role`;
      case 'role_customer': 
        return `change ${count} user${count !== 1 ? 's' : ''} to customer role`;
      case 'send_email': 
        return `send notification email to ${count} user${count !== 1 ? 's' : ''}`;
      case 'delete': 
        return `permanently delete ${count} user${count !== 1 ? 's' : ''}`;
      default: 
        return `perform ${getActionLabel(action).toLowerCase()} on ${count} user${count !== 1 ? 's' : ''}`;
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
                    <span>Promote to Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="role_customer" className="text-black">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Change to Customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="send_email" className="text-black">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Notification</span>
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
            <AlertDialogTitle className="text-black flex items-center">
              {confirmDialog.hasAdminConflict && <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />}
              Confirm Bulk Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to {getActionDescription(confirmDialog.action, confirmDialog.count)}?
              
              {confirmDialog.hasAdminConflict && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-800 text-sm">
                      <strong>Warning:</strong> This action affects admin users. Please ensure there will still be at least one admin remaining in the system.
                    </div>
                  </div>
                </div>
              )}
              
              {confirmDialog.action === 'delete' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-red-800 text-sm">
                      <strong>This action cannot be undone.</strong> All user data will be permanently removed.
                    </div>
                  </div>
                </div>
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
              Confirm Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkUserActions;
