
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: 'all' | 'admin' | 'customer';
  setRoleFilter: (value: 'all' | 'admin' | 'customer') => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  statusFilter: 'all' | 'pending' | 'approved' | 'denied';
  setStatusFilter: (value: 'all' | 'pending' | 'approved' | 'denied') => void;
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
    <div className="bg-white border border-black rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-black" />
          <span className="font-medium text-black">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="border-black text-black hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-black text-black"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-white border-black text-black">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            <SelectItem value="all" className="text-black">All Roles</SelectItem>
            <SelectItem value="admin" className="text-black">Admin</SelectItem>
            <SelectItem value="customer" className="text-black">Customer</SelectItem>
          </SelectContent>
        </Select>

        {/* Approval Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white border-black text-black">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            <SelectItem value="all" className="text-black">All Status</SelectItem>
            <SelectItem value="pending" className="text-black">Pending</SelectItem>
            <SelectItem value="approved" className="text-black">Approved</SelectItem>
            <SelectItem value="denied" className="text-black">Denied</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Input
          type="date"
          placeholder="Registration date from"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border-black text-black"
        />

        {/* Filter Summary */}
        <div className="flex items-center text-sm text-black">
          {hasActiveFilters && (
            <span className="bg-gray-100 px-2 py-1 rounded border border-black">
              {[
                searchTerm && 'Search',
                roleFilter !== 'all' && 'Role',
                statusFilter !== 'all' && 'Status',
                dateFilter && 'Date'
              ].filter(Boolean).join(', ')} active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
