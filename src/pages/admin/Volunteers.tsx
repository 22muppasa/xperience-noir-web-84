import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Eye,
  Check,
  X,
  Trash,
  Filter,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';

type VolunteerApplication = Tables<'volunteer_applications'>;

const Volunteers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Fetch volunteer applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['volunteer-applications', selectedStatus],
    queryFn: async (): Promise<VolunteerApplication[]> => {
      let query = supabase
        .from('volunteer_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-applications'] });
      toast({
        title: 'Application updated',
        description: 'The volunteer application status has been updated successfully.',
      });
      setSelectedApplication(null);
      setReviewNotes('');
    },
    onError: (error) => {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the application status.',
        variant: 'destructive',
      });
    },
  });

  // Delete application mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('volunteer_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-applications'] });
      toast({
        title: 'Application deleted',
        description: 'The volunteer application has been deleted.',
      });
    },
    onError: (error) => {
      console.error('Error deleting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the application.',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (status: string) => {
    if (selectedApplication) {
      updateStatusMutation.mutate({
        id: selectedApplication.id,
        status,
        notes: reviewNotes,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      withdrawn: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Volunteer Applications</h1>
            <p className="text-gray-600">Manage and review volunteer applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-2 border-black">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-black">Total Applications</p>
                  <p className="text-2xl font-bold text-black">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-black">Pending Review</p>
                  <p className="text-2xl font-bold text-black">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Check className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-black">Approved</p>
                  <p className="text-2xl font-bold text-black">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <X className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-black">Rejected</p>
                  <p className="text-2xl font-bold text-black">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Filter className="h-5 w-5" />
              Filter Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected', 'withdrawn'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-1">
                      ({applications.filter(app => app.status === status).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white border-2 border-black text-black">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center p-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">No applications found</h3>
                <p className="text-gray-600">No volunteer applications match your current filter.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Area of Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.area_of_interest}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                              >
                                <Eye className="h-4 w-4 text-white" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Volunteer Application Details</DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Name</label>
                                      <p className="text-black">{selectedApplication.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Status</label>
                                      <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        Email
                                      </label>
                                      <p className="text-black">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                      </label>
                                      <p className="text-black">{selectedApplication.phone || 'Not provided'}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Area of Interest</label>
                                    <p className="text-black">{selectedApplication.area_of_interest}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Availability</label>
                                    <p className="text-black">{selectedApplication.availability}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Experience</label>
                                    <p className="text-black whitespace-pre-wrap">{selectedApplication.experience}</p>
                                  </div>

                                  {selectedApplication.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Admin Notes</label>
                                      <p className="text-black whitespace-pre-wrap">{selectedApplication.notes}</p>
                                    </div>
                                  )}

                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Review Notes</label>
                                    <Textarea
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="Add notes about this application..."
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() => handleStatusUpdate('approved')}
                                      disabled={updateStatusMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate('rejected')}
                                      disabled={updateStatusMutation.isPending}
                                      variant="destructive"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => deleteMutation.mutate(selectedApplication.id)}
                                      disabled={deleteMutation.isPending}
                                      variant="outline"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Volunteers;
