
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mail, 
  Calendar, 
  Shield, 
  User, 
  Check, 
  X, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
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
  role: 'admin';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_at: string;
  approved_by: string;
  created_at: string;
  phone?: string;
  date_of_birth?: string;
}

interface UserDetailsDialogProps {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserDetailsDialog = ({ user, isOpen, onClose, onUserUpdated }: UserDetailsDialogProps) => {
  const [newApprovalStatus, setNewApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const { user: currentUser, signOut } = useAuth();
  const queryClient = useQueryClient();

  // Initialize form values when user changes
  React.useEffect(() => {
    if (user) {
      setNewApprovalStatus(user.approval_status);
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      updates 
    }: { 
      userId: string; 
      updates: { approval_status?: 'pending' | 'approved' | 'rejected' } 
    }) => {
      // Update approval status
      if (updates.approval_status) {
        const { error } = await supabase.rpc('update_user_approval_status', {
          target_user_id: userId,
          new_status: updates.approval_status
        });
        
        if (error) throw error;
      }
      
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User updated successfully",
        description: "The user's information has been updated.",
      });
      onUserUpdated();
      onClose();
    },
    onError: (error) => {
      console.error('User update error:', error);
      toast({
        title: "Error updating user",
        description: "Failed to update user information. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Call our edge function for complete user deletion
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User deleted successfully",
        description: "The user has been permanently removed from the system.",
      });
      
      // If the current user deleted themselves, sign them out
      if (user?.id === currentUser?.id) {
        signOut();
        return;
      }
      
      onUserUpdated();
      onClose();
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      console.error('User deletion error:', error);
      toast({
        title: "Error deleting user",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveChanges = () => {
    if (!user) return;
    
    const updates: { approval_status?: 'pending' | 'approved' | 'rejected' } = {};
    
    if (newApprovalStatus !== user.approval_status) {
      updates.approval_status = newApprovalStatus;
    }
    
    if (Object.keys(updates).length === 0) {
      toast({
        title: "No changes to save",
        description: "No modifications were made to the user.",
      });
      return;
    }
    
    updateUserMutation.mutate({ userId: user.id, updates });
  };

  const handleDeleteUser = () => {
    if (!user) return;
    deleteUserMutation.mutate(user.id);
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
    }
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white border-black max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-black flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-black">
                <Shield className="h-5 w-5 text-black" />
              </div>
              <div>
                <span>{user.first_name} {user.last_name}</span>
                {getApprovalBadge(user.approval_status)}
              </div>
            </DialogTitle>
            <DialogDescription className="text-black">
              Manage user permissions and account status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-black">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {user.approved_at && (
                <div className="text-sm text-gray-600">
                  Approved on: {new Date(user.approved_at).toLocaleDateString()}
                </div>
              )}
              <div className="flex items-center space-x-2 text-black">
                <Shield className="h-4 w-4" />
                <span>Administrator</span>
              </div>
            </div>

            {/* Approval Status Management */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">Approval Status</h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-black">Status:</label>
                <Select value={newApprovalStatus} onValueChange={(value: 'pending' | 'approved' | 'rejected') => setNewApprovalStatus(value)}>
                  <SelectTrigger className="w-48 bg-white border-black text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black">
                    <SelectItem value="pending" className="text-black">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="approved" className="text-black">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Approved</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected" className="text-black">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Rejected</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-red-200 pt-4">
              <h3 className="text-lg font-semibold text-red-600 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </h3>
              <p className="text-sm text-red-600 mt-2">
                Permanently delete this administrator and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-3"
                disabled={deleteUserMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Administrator
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white border-2 border-black text-black hover:bg-gray-100 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={updateUserMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-white border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Delete Administrator Account</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to permanently delete <strong>{user.first_name} {user.last_name}</strong>'s administrator account?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                This will permanently remove:
              </span>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Administrator profile and account data</li>
                <li>Authentication credentials</li>
                <li>All associated enrollments and relationships</li>
                <li>All messages and notifications</li>
                <li>Any uploaded work or files</li>
              </ul>
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
              {user.id === currentUser?.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <span className="text-red-800 font-medium text-sm">
                    Warning: You are about to delete your own account. You will be signed out immediately.
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-2 border-black text-black hover:bg-gray-100 font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete Administrator'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDetailsDialog;
