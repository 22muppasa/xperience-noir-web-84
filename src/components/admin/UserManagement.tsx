
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  last_sign_in_at?: string | null;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Transform the data to match our User interface
      return data.map(profile => ({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        created_at: profile.created_at,
        last_sign_in_at: null // We don't have this data from profiles table
      })) as User[];
    }
  });

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customerUsers = filteredUsers.filter(user => user.role === 'customer');
  const adminUsers = filteredUsers.filter(user => user.role === 'admin');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-black">Loading users...</p>
        </div>
      </div>
    );
  }

  const UserCard = ({ user }: { user: User }) => (
    <Card className="bg-white border-black">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-black">
            {user.first_name && user.last_name 
              ? `${user.first_name} ${user.last_name}`
              : user.email
            }
          </CardTitle>
          <Badge 
            variant="outline" 
            className={user.role === 'admin' 
              ? 'text-purple-600 border-purple-600 bg-white' 
              : 'text-blue-600 border-blue-600 bg-white'
            }
          >
            {user.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-black">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-black">
          <Calendar className="h-4 w-4" />
          <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
        </div>
        
        {user.last_sign_in_at && (
          <div className="flex items-center space-x-2 text-sm text-black">
            <span>Last sign in: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">User Management</h2>
          <p className="text-black">Manage customer accounts and administrators</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-black text-black placeholder:text-gray-500"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-black" />
              <div>
                <p className="text-2xl font-bold text-black">{users.length}</p>
                <p className="text-sm text-black">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-black">{customerUsers.length}</p>
                <p className="text-sm text-black">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-black">{adminUsers.length}</p>
                <p className="text-sm text-black">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-black">
          Customers ({customerUsers.length})
        </h3>
        {customerUsers.length === 0 ? (
          <Card className="bg-white border-black">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">No customers found</h3>
              <p className="text-black">No customer accounts match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>

      {/* Administrators Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-black">
          Administrators ({adminUsers.length})
        </h3>
        {adminUsers.length === 0 ? (
          <Card className="bg-white border-black">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">No administrators found</h3>
              <p className="text-black">No administrator accounts match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
