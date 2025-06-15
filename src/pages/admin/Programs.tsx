
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, Plus, Users, Calendar, Edit, Trash2, DollarSign } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  max_participants: number | null;
  status: string;
  created_at: string;
}

const AdminPrograms = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    price: '',
    max_participants: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real programs from Supabase
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Program[];
    }
  });

  // Fetch enrollment stats
  const { data: enrollmentStats } = useQuery({
    queryKey: ['enrollment-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('program_id, status')
        .in('status', ['active', 'confirmed']);

      if (error) throw error;

      const stats = (data || []).reduce((acc: Record<string, number>, enrollment) => {
        if (enrollment.program_id) {
          acc[enrollment.program_id] = (acc[enrollment.program_id] || 0) + 1;
        }
        return acc;
      }, {});

      return stats;
    }
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: async (programData: typeof newProgram) => {
      const { error } = await supabase
        .from('programs')
        .insert([{
          title: programData.title,
          description: programData.description || null,
          start_date: programData.start_date || null,
          end_date: programData.end_date || null,
          price: programData.price ? parseFloat(programData.price) : null,
          max_participants: programData.max_participants ? parseInt(programData.max_participants) : null,
          status: 'active'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Program created",
        description: "The program has been created successfully.",
      });
      setNewProgram({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        price: '',
        max_participants: ''
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Program deleted",
        description: "The program has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    }
  });

  const handleCreateProgram = () => {
    if (!newProgram.title) {
      toast({
        title: "Error",
        description: "Please enter a program title.",
        variant: "destructive",
      });
      return;
    }

    createProgramMutation.mutate(newProgram);
  };

  const activePrograms = programs.filter(p => p.status === 'active');
  const draftPrograms = programs.filter(p => p.status === 'draft');
  const totalRevenue = programs.reduce((sum, program) => {
    const enrolled = enrollmentStats?.[program.id] || 0;
    const price = program.price || 0;
    return sum + (enrolled * price);
  }, 0);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Program Management</h1>
            <p className="text-black">Create and manage camp programs</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-black">
              <DialogHeader>
                <DialogTitle className="text-black">Create New Program</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Title</label>
                  <Input
                    value={newProgram.title}
                    onChange={(e) => setNewProgram({...newProgram, title: e.target.value})}
                    placeholder="Program title..."
                    className="bg-white text-black border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Description</label>
                  <Textarea
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                    placeholder="Program description..."
                    className="bg-white text-black border-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Start Date</label>
                    <Input
                      type="date"
                      value={newProgram.start_date}
                      onChange={(e) => setNewProgram({...newProgram, start_date: e.target.value})}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">End Date</label>
                    <Input
                      type="date"
                      value={newProgram.end_date}
                      onChange={(e) => setNewProgram({...newProgram, end_date: e.target.value})}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Price ($)</label>
                    <Input
                      type="number"
                      value={newProgram.price}
                      onChange={(e) => setNewProgram({...newProgram, price: e.target.value})}
                      placeholder="0.00"
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Max Participants</label>
                    <Input
                      type="number"
                      value={newProgram.max_participants}
                      onChange={(e) => setNewProgram({...newProgram, max_participants: e.target.value})}
                      placeholder="20"
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCreateProgram}
                    disabled={createProgramMutation.isPending}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {createProgramMutation.isPending ? 'Creating...' : 'Create Program'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-black text-black"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Programs</TabsTrigger>
            <TabsTrigger value="active">Active Programs</TabsTrigger>
            <TabsTrigger value="draft">Draft Programs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <BookOpen className="mr-2 h-5 w-5" />
                  All Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {programs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Program</TableHead>
                        <TableHead className="text-black">Dates</TableHead>
                        <TableHead className="text-black">Price</TableHead>
                        <TableHead className="text-black">Enrollment</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programs.map((program) => {
                        const enrolled = enrollmentStats?.[program.id] || 0;
                        const maxParticipants = program.max_participants || 0;
                        
                        return (
                          <TableRow key={program.id}>
                            <TableCell>
                              <div className="text-black">
                                <div className="font-medium">{program.title}</div>
                                <div className="text-sm">{program.description}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-black">
                              <div className="text-sm">
                                <div>{program.start_date || 'Not set'}</div>
                                <div>to {program.end_date || 'Not set'}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-black">
                              ${program.price?.toFixed(2) || '0.00'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-black">
                                <Users className="h-4 w-4 mr-1" />
                                {enrolled}/{maxParticipants || '∞'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={program.status === 'active' ? 'default' : 'secondary'}
                                className="text-white"
                              >
                                {program.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="border-black text-black">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-black text-red-600 hover:bg-red-50"
                                  onClick={() => deleteProgramMutation.mutate(program.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-black">No programs created yet</p>
                    <p className="text-sm text-black">Create your first program to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Active Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePrograms.map((program) => (
                    <Card key={program.id} className="bg-white border-black">
                      <CardHeader>
                        <CardTitle className="text-lg text-black">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-black mb-2">{program.description}</p>
                        <div className="space-y-1 text-sm text-black">
                          <div>Start: {program.start_date || 'Not set'}</div>
                          <div>End: {program.end_date || 'Not set'}</div>
                          <div>Price: ${program.price?.toFixed(2) || '0.00'}</div>
                          <div>Enrolled: {enrollmentStats?.[program.id] || 0}/{program.max_participants || '∞'}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Draft Programs</CardTitle>
              </CardHeader>
              <CardContent>
                {draftPrograms.length > 0 ? (
                  <div className="space-y-4">
                    {draftPrograms.map((program) => (
                      <div key={program.id} className="flex items-center justify-between p-4 border border-black rounded-lg bg-white">
                        <div>
                          <h3 className="font-medium text-black">{program.title}</h3>
                          <p className="text-sm text-black">{program.description}</p>
                          <p className="text-sm text-black">
                            {program.start_date} - {program.end_date} | ${program.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-black text-black">Edit</Button>
                          <Button size="sm" className="bg-black text-white hover:bg-gray-800">Publish</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-black">No draft programs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Program Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border border-black rounded-lg bg-white">
                    <div className="text-2xl font-bold text-black">
                      {Object.values(enrollmentStats || {}).reduce((sum, count) => sum + count, 0)}
                    </div>
                    <div className="text-sm text-black">Total Enrollments</div>
                  </div>
                  <div className="text-center p-4 border border-black rounded-lg bg-white">
                    <div className="text-2xl font-bold text-black">${totalRevenue.toFixed(2)}</div>
                    <div className="text-sm text-black">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 border border-black rounded-lg bg-white">
                    <div className="text-2xl font-bold text-black">{activePrograms.length}</div>
                    <div className="text-sm text-black">Active Programs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPrograms;
