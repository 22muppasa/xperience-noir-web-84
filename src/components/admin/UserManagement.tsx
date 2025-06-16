import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Calendar, Shield, User, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
}

const UserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [roleChangeDialog, setRoleChangeDialog] = useState<{
    isOpen: boolean;
    user: Profile | null;
    newRole: 'admin' | 'customer' | null;
  }>({ isOpen: false, user: null, newRole: null });
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'customer' as 'admin' | 'customer',
    phone: '',
    date_of_birth: ''
  });

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

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      // For demo purposes, create a profile entry
      // In production, you'd use Supabase Auth admin functions
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: crypto.randomUUID(),
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          phone: userData.phone
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsCreateUserOpen(false);
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        role: 'customer',
        phone: '',
        date_of_birth: ''
      });
      toast({
        title: "User created successfully",
        description: "New user profile has been created",
      });
    },
    onError: (error) => {
      console.error('Create user error:', error);
      toast({
        title: "Error creating user",
        description: "Failed to create user profile. Please try again.",
        variant: "destructive",
      });
    }
  });

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

  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesDate = dateFilter === '' || 
      new Date(user.created_at) >= new Date(dateFilter);

    return matchesSearch && matchesRole && matchesDate;
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
        
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black border border-black hover:bg-gray-100">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-black">First Name</Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                    className="bg-white border-black text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-black">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                    className="bg-white border-black text-black"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-black">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-black text-black"
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-black">Role</Label>
                <Select value={newUser.role} onValueChange={(value: 'admin' | 'customer') => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-white border-black text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black">
                    <SelectItem value="customer" className="text-black">Customer</SelectItem>
                    <SelectItem value="admin" className="text-black">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => createUserMutation.mutate(newUser)}
                className="w-full bg-white text-black border border-black hover:bg-gray-100"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-black">
                      {user.first_name} {user.last_name}
                    </h3>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="bg-white text-black border border-black">
                      {user.role}
                    </Badge>
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
                  <Select
                    value={user.role}
                    onValueChange={(value: 'admin' | 'customer') => handleRoleChange(user, value)}
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
    </div>
  );
};

export default UserManagement;
