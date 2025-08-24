
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar, Shield, User, Check, X, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
import BulkUserActions from './BulkUserActions';
import UserFilters from './UserFilters';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'customer';
  created_at: string;
  phone?: string;
  date_of_birth?: string;
  approval_status: 'pending' | 'approved' | 'denied';
  approved_by?: string;
  approved_at?: string;
}

const UserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [roleChangeDialog, setRoleChangeDialog] = useState<{
    isOpen: boolean;
    user: Profile | null;
    newRole: 'admin' | 'customer' | null;
  }>({ isOpen: false, user: null, newRole: null });
  const [approvalDialog, setApprovalDialog] = useState<{
    isOpen: boolean;
    user: Profile | null;
    action: 'approve' | 'deny' | null;
  }>({ isOpen: false, user: null, action: null });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[UserManagement] Failed to fetch users:', error);
        throw error;
      }
      return data as Profile[];
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'customer' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role updated successfully",
        description: `User role has been changed to ${data.role}`,
      });
      setRoleChangeDialog({ isOpen: false, user: null, newRole: null });
    },
    onError: (error) => {
      console.error('Role update error:', error);
      toast({
        title: "Error updating role",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateApprovalStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'approved' | 'denied' }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          approval_status: status,
          approved_by: status === 'approved' ? (await supabase.auth.getUser()).data.user?.id : null,
          approved_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: `User ${variables.status}`,
        description: `User has been ${variables.status} successfully`,
      });
      setApprovalDialog({ isOpen: false, user: null, action: null });
    },
    onError: (error) => {
      console.error('Approval status update error:', error);
      toast({
        title: "Error updating approval status",
        description: "Failed to update user approval status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleRoleChange = (user: Profile, newRole: 'admin' | 'customer') => {
    if (user.role !== newRole) {
      setRoleChangeDialog({
        isOpen: true,
        user,
        newRole
      });
    }
  };

  const handleApprovalAction = (user: Profile, action: 'approve' | 'deny') => {
    setApprovalDialog({
      isOpen: true,
      user,
      action
    });
  };

  const confirmRoleChange = () => {
    if (roleChangeDialog.user && roleChangeDialog.newRole) {
      updateUserRoleMutation.mutate({
        userId: roleChangeDialog.user.id,
        role: roleChangeDialog.newRole
      });
    }
  };

  const confirmApprovalAction = () => {
    if (approvalDialog.user && approvalDialog.action) {
      updateApprovalStatusMutation.mutate({
        userId: approvalDialog.user.id,
        status: approvalDialog.action === 'approve' ? 'approved' : 'denied'
      });
    }
  };

  const handleUserSelection = (user: Profile, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, user]);
    } else {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredUsers) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setDateFilter('');
    setStatusFilter('all');
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><X className="h-3 w-3 mr-1" />Denied</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesDate = dateFilter === '' || 
      new Date(user.created_at) >= new Date(dateFilter);

    const matchesStatus = statusFilter === 'all' || user.approval_status === statusFilter;

    return matchesSearch && matchesRole && matchesDate && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white border-black">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <Card className="bg-red-50 border-red-300">
          <CardHeader>
            <CardTitle className="text-red-900">Error loading users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-700 mb-2">
              We couldn't retrieve user data from the database at this time.
            </div>
            <div className="text-sm text-red-500 mb-4">
              {error instanceof Error
                ? error.message
                : "The database service may be temporarily unavailable. Please try again later."}
            </div>
            <Button className="bg-black text-white" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">User Management</h2>
          <p className="text-black">Manage all users and their permissions</p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      <BulkUserActions
        selectedUsers={selectedUsers}
        onClearSelection={() => setSelectedUsers([])}
      />

      {/* Users List with Selection */}
      <Card className="bg-white border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-black">Users ({filteredUsers?.length || 0})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUsers.length === filteredUsers?.length && filteredUsers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-black">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <Checkbox
                  checked={selectedUsers.some(u => u.id === user.id)}
                  onCheckedChange={(checked) => handleUserSelection(user, checked as boolean)}
                />
                
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-black">
                  {user.role === 'admin' ? (
                    <Shield className="h-5 w-5 text-black" />
                  ) : (
                    <User className="h-5 w-5 text-black" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-black">
                      {user.first_name} {user.last_name}
                    </h3>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="bg-white text-black border border-black">
                      {user.role}
                    </Badge>
                    {getApprovalStatusBadge(user.approval_status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-black">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.approval_status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprovalAction(user, 'approve')}
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={updateApprovalStatusMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApprovalAction(user, 'deny')}
                        disabled={updateApprovalStatusMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </>
                  )}
                  
                  <Select
                    value={user.role}
                    onValueChange={(value: 'admin' | 'customer') => handleRoleChange(user, value)}
                    disabled={user.approval_status !== 'approved'}
                  >
                    <SelectTrigger className="w-32 bg-white border-black text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-black">
                      <SelectItem value="customer" className="text-black">Customer</SelectItem>
                      <SelectItem value="admin" className="text-black">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredUsers?.length === 0 && (
        <Card className="bg-white border-black">
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-black mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">No users found</h3>
            <p className="text-black">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={roleChangeDialog.isOpen} onOpenChange={(open) => 
        setRoleChangeDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <AlertDialogContent className="bg-white border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to change {roleChangeDialog.user?.first_name} {roleChangeDialog.user?.last_name}'s 
              role from {roleChangeDialog.user?.role} to {roleChangeDialog.newRole}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              disabled={updateUserRoleMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {updateUserRoleMutation.isPending ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Action Confirmation Dialog */}
      <AlertDialog open={approvalDialog.isOpen} onOpenChange={(open) => 
        setApprovalDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <AlertDialogContent className="bg-white border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              Confirm {approvalDialog.action === 'approve' ? 'Approval' : 'Denial'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to {approvalDialog.action} {approvalDialog.user?.first_name} {approvalDialog.user?.last_name}?
              {approvalDialog.action === 'deny' && (
                <span className="block mt-2 text-red-600 font-medium">
                  This user will not be able to access admin functions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprovalAction}
              disabled={updateApprovalStatusMutation.isPending}
              className={approvalDialog.action === 'approve' 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-red-600 text-white hover:bg-red-700"
              }
            >
              {updateApprovalStatusMutation.isPending ? 'Processing...' : 
                (approvalDialog.action === 'approve' ? 'Approve User' : 'Deny User')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
