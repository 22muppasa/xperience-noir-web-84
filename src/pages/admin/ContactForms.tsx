// src/pages/admin/AdminContactForms.tsx
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

const AdminContactForms = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Status updated', description: 'Contact submission status has been updated.' });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-white text-black border-black';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-black">Loading contact submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Contact Form Management</h1>
          <p className="text-black">Manage and respond to contact form submissions</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="all" className="text-black">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-black">Unread</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-black">In Progress</TabsTrigger>
            <TabsTrigger value="responded" className="text-black">Responded</TabsTrigger>
          </TabsList>

          {/* -- All Submissions Tab -- */}
          <TabsContent value="all" className="space-y-4">
            {/* summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {['unread','in_progress','responded','all'].map((key, i) => (
                <Card key={i} className="bg-white border-black">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-black">
                      {key === 'all' 
                        ? submissions.length 
                        : submissions.filter(s => s.status === key).length
                      }
                    </div>
                    <div className="text-sm text-black">
                      {key === 'all' ? 'Total' : key.replace('_',' ')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* detailed table */}
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Mail className="mr-2 h-5 w-5" /> Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Contact</TableHead>
                        <TableHead className="text-black">Subject</TableHead>
                        <TableHead className="text-black">Submitted</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-black" />
                              <span className="text-black font-medium">{sub.name}</span>
                            </div>
                            <div className="text-sm text-black">{sub.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-black font-medium">{sub.subject}</div>
                            <div className="text-sm text-black truncate max-w-xs">{sub.message}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-black">
                              <Clock className="h-4 w-4 mr-1" />
                              {sub.created_at && new Date(sub.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(sub.status || 'unread')}>
                              {(sub.status || 'unread').replace('_',' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-black text-black hover:bg-gray-50"
                                onClick={() => updateStatusMutation.mutate({ id: sub.id, status: 'in_progress' })}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-black text-black hover:bg-gray-50"
                                onClick={() => markAsRespondedMutation.mutate(sub.id)}
                              >
                                Mark Responded
                              </Button>
                              <Button size="sm" variant="outline" className="border-black text-black hover:bg-gray-50">
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
                    <p className="text-black">No contact submissions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* -- Unread, In Progress, Responded Tabs (same mapping) -- */}
          {['unread','in_progress','responded'].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card className="bg-white border-black">
                <CardHeader>
                  <CardTitle className="text-black">{status.replace('_',' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.filter(s => s.status === status).map(sub => (
                      <div key={sub.id} className={`p-4 border rounded-lg border-black bg-${status==='unread'?'red':'in_progress'?'blue':'green'}-50`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-black">{sub.subject}</h3>
                            <p className="text-sm text-black">From: {sub.name} ({sub.email})</p>
                            <p className="text-sm text-black">{sub.created_at && new Date(sub.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge className={status==='unread'?'bg-red-100 text-red-800 border-red-200':status==='in_progress'?'bg-blue-100 text-blue-800 border-blue-200':'bg-green-100 text-green-800 border-green-200'}>
                            {status.replace('_',' ')}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3 text-black">{sub.message}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                            {status==='unread'?'Reply':'Continue'}
                          </Button>
                          {status !== 'responded' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-black text-black hover:bg-gray-50"
                              onClick={() => markAsRespondedMutation.mutate(sub.id)}
                            >
                              Mark as Responded
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {submissions.filter(s => s.status === status).length === 0 && (
                      <p className="text-center text-black py-8">No {status.replace('_',' ')} submissions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminContactForms;
