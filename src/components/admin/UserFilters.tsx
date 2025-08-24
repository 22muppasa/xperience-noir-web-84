
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: 'all' | 'admin' | 'customer';
  setRoleFilter: (role: 'all' | 'admin' | 'customer') => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
  onClearFilters: () => void;
}

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters
}: UserFiltersProps) => {
  const hasActiveFilters = searchTerm || roleFilter !== 'all' || dateFilter || statusFilter !== 'all';

  return (
    <div className="bg-white border border-black rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-4 w-4 text-black" />
        <h3 className="font-medium text-black">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-black"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-black text-black placeholder:text-gray-500"
          />
        </div>

        <Select value={roleFilter} onValueChange={(value: 'all' | 'admin' | 'customer') => setRoleFilter(value)}>
          <SelectTrigger className="bg-white border-black text-black">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            <SelectItem value="all" className="text-black">All Roles</SelectItem>
            <SelectItem value="admin" className="text-black">Admins</SelectItem>
            <SelectItem value="customer" className="text-black">Customers</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
          <SelectTrigger className="bg-white border-black text-black">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            <SelectItem value="all" className="text-black">All Status</SelectItem>
            <SelectItem value="active" className="text-black">Active</SelectItem>
            <SelectItem value="inactive" className="text-black">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="Created after..."
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border-black text-black"
        />
      </div>
    </div>
  );
};

export default UserFilters;
