// src/pages/admin/ContactForms.tsx
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
import { Mail, Clock, User, Archive, Reply } from 'lucide-react';

type SubmissionStatus = 'unread' | 'read' | 'archived' | 'in_progress' | 'responded';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  created_at: string | null;
  responded_at?: string | null;
}

const getStatusColor = (status: SubmissionStatus) => {
  switch (status) {
    case 'unread':      return 'bg-red-100 text-red-800 border-red-200';
    case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'responded':   return 'bg-green-100 text-green-800 border-green-200';
    default:            return 'bg-white text-black border-black';
  }
};

const AdminContactForms: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Submission[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Status updated', description: 'Contact submission status has been updated.' });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  });

  const markAsRespondedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'responded', responded_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Marked as responded', description: 'Contact submission has been marked as responded.' });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black">Loading contact submissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Helper to render a table for a filtered list
  const renderTable = (list: Submission[]) => (
    list.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map(sub => (
            <TableRow key={sub.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-black" />
                  <span className="font-medium text-black">{sub.name}</span>
                </div>
                <div className="text-sm text-black">{sub.email}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-black">{sub.subject}</div>
                <div className="text-sm text-black truncate max-w-xs">{sub.message}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-black">
                  <Clock className="mr-1 h-4 w-4" />
                  {sub.created_at && new Date(sub.created_at).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(sub.status)}>
                  {sub.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white border-black text-black hover:bg-black hover:text-white"
                    onClick={() => updateStatusMutation.mutate({ id: sub.id, status: 'in_progress' })}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white border-black text-black hover:bg-black hover:text-white"
                    onClick={() => markAsRespondedMutation.mutate(sub.id)}
                  >Mark Responded</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white border-black text-black hover:bg-black hover:text-white"
                    onClick={() => updateStatusMutation.mutate({ id: sub.id, status: 'archived' })}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="text-center py-8">
        <Mail className="h-12 w-12 text-black mx-auto mb-4" />
        <p className="text-black">No submissions in this category</p>
      </div>
    )
  );

  // Filtered lists
  const unreadList      = submissions.filter(s => s.status === 'unread');
  const inProgressList = submissions.filter(s => s.status === 'in_progress');
  const respondedList   = submissions.filter(s => s.status === 'responded');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Contact Form Management</h1>
          <p className="text-black">Manage and respond to contact form submissions</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
          </TabsList>

          {/* All */}
          <TabsContent value="all">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{unreadList.length}</div>
                  <div className="text-sm text-black">Unread</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{inProgressList.length}</div>
                  <div className="text-sm text-black">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{respondedList.length}</div>
                  <div className="text-sm text-black">Responded</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{submissions.length}</div>
                  <div className="text-sm text-black">Total</div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Mail className="mr-2 h-5 w-5" /> Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(submissions)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unread */}
          <TabsContent value="unread">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Unread Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(unreadList)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* In Progress */}
          <TabsContent value="in_progress">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(inProgressList)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Responded */}
          <TabsContent value="responded">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Responded</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(respondedList)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminContactForms;
