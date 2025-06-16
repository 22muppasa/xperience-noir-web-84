import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Users, AlertTriangle } from 'lucide-react';

interface Enrollment {
  id: string;
  child_name: string;
  enrolled_at: string;
  status: string;
  notes?: string;
  child_id?: string;
  customer_id?: string;
  programs?: {
    title: string;
  } | null;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  children?: {
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
  } | null;
}

const AdminEnrollments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all enrollments with related data
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['admin-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          enrolled_at,
          status,
          notes,
          child_id,
          customer_id,
          programs(title),
          children(
            first_name,
            last_name,
            date_of_birth
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately for each enrollment
      const enrollmentsWithProfiles = await Promise.all(
        (data || []).map(async (enrollment) => {
          if (enrollment.customer_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', enrollment.customer_id)
              .single();
            
            return {
              ...enrollment,
              profiles: profile
            };
          }
          return {
            ...enrollment,
            profiles: null
          };
        })
      );

      return enrollmentsWithProfiles as Enrollment[];
    }
  });

  // Approve enrollment mutation
  const approveEnrollmentMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'active' })
        .eq('id', enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Approved",
        description: "The enrollment has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve enrollment",
        variant: "destructive",
      });
    }
  });

  // Reject enrollment mutation
  const rejectEnrollmentMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled' })
        .eq('id', enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Rejected",
        description: "The enrollment has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject enrollment",
        variant: "destructive",
      });
    }
  });

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const cancelledEnrollments = enrollments.filter(e => e.status === 'cancelled');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Enrollment Management</h1>
          <p className="text-black">Review and approve program enrollments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Pending Approval</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingEnrollments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Active Enrollments</p>
                  <p className="text-2xl font-bold text-green-600">{activeEnrollments.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{cancelledEnrollments.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Total Enrollments</p>
                  <p className="text-2xl font-bold text-black">{enrollments.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-black" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approval ({pendingEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Enrollments</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Clock className="mr-2 h-5 w-5" />
                  Pending Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEnrollments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Child</TableHead>
                        <TableHead className="text-black">Program</TableHead>
                        <TableHead className="text-black">Parent</TableHead>
                        <TableHead className="text-black">Enrolled Date</TableHead>
                        <TableHead className="text-black">Notes</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div className="text-black">
                              <div className="font-medium">{enrollment.child_name}</div>
                              {enrollment.children?.date_of_birth && (
                                <div className="text-sm text-gray-500">
                                  Born: {new Date(enrollment.children.date_of_birth).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-black">{enrollment.programs?.title || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="text-black">
                              <div className="font-medium">
                                {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{enrollment.profiles?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-black">
                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-black max-w-xs">
                            <div className="truncate" title={enrollment.notes || ''}>
                              {enrollment.notes || 'No notes'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveEnrollmentMutation.mutate(enrollment.id)}
                                disabled={approveEnrollmentMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectEnrollmentMutation.mutate(enrollment.id)}
                                disabled={rejectEnrollmentMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-black">No Pending Enrollments</h3>
                    <p className="text-black">All enrollment requests have been processed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Users className="mr-2 h-5 w-5" />
                  Active Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeEnrollments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Child</TableHead>
                        <TableHead className="text-black">Program</TableHead>
                        <TableHead className="text-black">Parent</TableHead>
                        <TableHead className="text-black">Enrolled Date</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="text-black font-medium">{enrollment.child_name}</TableCell>
                          <TableCell className="text-black">{enrollment.programs?.title || 'N/A'}</TableCell>
                          <TableCell className="text-black">
                            {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                          </TableCell>
                          <TableCell className="text-black">
                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-black">No Active Enrollments</h3>
                    <p className="text-black">No approved enrollments at this time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">All Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">Child</TableHead>
                      <TableHead className="text-black">Program</TableHead>
                      <TableHead className="text-black">Parent</TableHead>
                      <TableHead className="text-black">Enrolled Date</TableHead>
                      <TableHead className="text-black">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="text-black font-medium">{enrollment.child_name}</TableCell>
                        <TableCell className="text-black">{enrollment.programs?.title || 'N/A'}</TableCell>
                        <TableCell className="text-black">
                          {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                        </TableCell>
                        <TableCell className="text-black">
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${
                              enrollment.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-700'
                                : enrollment.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-700'
                                : 'bg-red-50 text-red-700 border-red-700'
                            }`}
                          >
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminEnrollments;
