
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

  // Fetch contact submissions from Supabase
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

  // Update submission status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'unread' | 'read' | 'archived' | 'in_progress' | 'responded' }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Contact submission status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mark as responded mutation
  const markAsRespondedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'responded' as any,
          responded_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Marked as responded",
        description: "Contact submission has been marked as responded.",
      });
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

  const handleStatusChange = (id: string, status: 'unread' | 'read' | 'archived' | 'in_progress' | 'responded') => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
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
            <TabsTrigger value="all" className="text-black">All Submissions</TabsTrigger>
            <TabsTrigger value="unread" className="text-black">Unread</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-black">In Progress</TabsTrigger>
            <TabsTrigger value="responded" className="text-black">Responded</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">
                    {submissions.filter(s => s.status === 'unread').length}
                  </div>
                  <div className="text-sm text-black">Unread</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">
                    {submissions.filter(s => s.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-black">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">
                    {submissions.filter(s => s.status === 'responded').length}
                  </div>
                  <div className="text-sm text-black">Responded</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">
                    {submissions.length}
                  </div>
                  <div className="text-sm text-black">Total Submissions</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Form Submissions
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
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center text-black">
                                <User className="h-4 w-4 mr-1" />
                                {submission.name}
                              </div>
                              <div className="text-sm text-black">{submission.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-black">{submission.subject}</div>
                              <div className="text-sm text-black truncate max-w-xs">
                                {submission.message}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-black">
                              <Clock className="h-4 w-4 mr-1" />
                              {submission.created_at && new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(submission.status || 'unread')}>
                              {(submission.status || 'unread').replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-black text-black hover:bg-gray-50"
                                onClick={() => handleStatusChange(submission.id, 'in_progress')}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-black text-black hover:bg-gray-50"
                                onClick={() => markAsRespondedMutation.mutate(submission.id)}
                              >
                                Mark Responded
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-black text-black hover:bg-gray-50"
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
                    <p className="text-black">No contact submissions yet</p>
                    <p className="text-sm text-black">Contact form submissions will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Unread Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'unread').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg border-black bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-black">{submission.subject}</h3>
                          <p className="text-sm text-black">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-black">{submission.created_at && new Date(submission.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Unread
                        </Badge>
                      </div>
                      <p className="text-sm mb-3 text-black">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          className="bg-black text-white hover:bg-gray-800"
                          onClick={() => handleStatusChange(submission.id, 'in_progress')}
                        >
                          Reply
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-black text-black hover:bg-gray-50"
                          onClick={() => handleStatusChange(submission.id, 'in_progress')}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submissions.filter(s => s.status === 'unread').length === 0 && (
                    <p className="text-center text-black py-8">No unread submissions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'in_progress').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg border-black bg-blue-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-black">{submission.subject}</h3>
                          <p className="text-sm text-black">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-black">{submission.created_at && new Date(submission.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-sm mb-3 text-black">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Continue
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-black text-black hover:bg-gray-50"
                          onClick={() => markAsRespondedMutation.mutate(submission.id)}
                        >
                          Mark as Responded
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submissions.filter(s => s.status === 'in_progress').length === 0 && (
                    <p className="text-center text-black py-8">No submissions in progress</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responded" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Responded Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'responded').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg border-black">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-black">{submission.subject}</h3>
                          <p className="text-sm text-black">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-black">{submission.created_at && new Date(submission.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Responded</Badge>
                      </div>
                      <p className="text-sm mb-3 text-black">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-black text-black hover:bg-gray-50"
                        >
                          View Response
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-black text-black hover:bg-gray-50"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submissions.filter(s => s.status === 'responded').length === 0 && (
                    <p className="text-center text-black py-8">No responded submissions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminContactForms;
