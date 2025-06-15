import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Award, Calendar, User } from 'lucide-react';

interface ChildMilestonesProps {
  childId?: string;
}

const ChildMilestones = ({ childId }: ChildMilestonesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    category: '',
    achievedDate: '',
    notes: '',
    childId: childId || ''
  });

  // Fetch my children for milestone creation
  const { data: myChildren = [] } = useQuery({
    queryKey: ['my-children-for-milestones', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          child_id,
          children!inner(
            id,
            first_name,
            last_name
          )
        `)
        .eq('parent_id', user.id);
      
      if (error) throw error;
      return data.map(rel => rel.children);
    },
    enabled: !!user?.id
  });

  // Fetch milestones with proper join to profiles table
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['child-milestones', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('child_milestones')
        .select(`
          *,
          children(first_name, last_name),
          profiles!inner(first_name, last_name)
        `)
        .eq('profiles.id', supabase.from('child_milestones').select('recorded_by'))
        .order('achieved_date', { ascending: false });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching milestones:', error);
        // Fallback query without profiles join
        const fallbackQuery = supabase
          .from('child_milestones')
          .select(`
            *,
            children(first_name, last_name)
          `)
          .order('achieved_date', { ascending: false });

        if (childId) {
          fallbackQuery.eq('child_id', childId);
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        if (fallbackError) throw fallbackError;
        return fallbackData || [];
      }
      return data || [];
    },
    enabled: !!user
  });

  const createMilestoneMutation = useMutation({
    mutationFn: async (milestoneData: any) => {
      const { error } = await supabase
        .from('child_milestones')
        .insert({
          title: milestoneData.title,
          description: milestoneData.description,
          category: milestoneData.category,
          achieved_date: milestoneData.achievedDate,
          notes: milestoneData.notes,
          child_id: milestoneData.childId,
          recorded_by: user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child-milestones'] });
      setIsCreateOpen(false);
      setNewMilestone({
        title: '',
        description: '',
        category: '',
        achievedDate: '',
        notes: '',
        childId: childId || ''
      });
      toast({
        title: "Milestone Added",
        description: "New milestone has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to add milestone.",
        variant: "destructive",
      });
    }
  });

  const categories = [
    { value: 'academic', label: 'Academic', color: 'bg-blue-100 text-blue-800' },
    { value: 'creative', label: 'Creative', color: 'bg-purple-100 text-purple-800' },
    { value: 'social', label: 'Social', color: 'bg-green-100 text-green-800' },
    { value: 'physical', label: 'Physical', color: 'bg-orange-100 text-orange-800' },
    { value: 'emotional', label: 'Emotional', color: 'bg-pink-100 text-pink-800' },
  ];

  const handleCreateMilestone = () => {
    if (!newMilestone.title || !newMilestone.category || !newMilestone.achievedDate || !newMilestone.childId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createMilestoneMutation.mutate(newMilestone);
  };

  const getCategoryStyle = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div>Loading milestones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Child Milestones</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Record New Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) => setNewMilestone(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="date"
                  value={newMilestone.achievedDate}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, achievedDate: e.target.value }))}
                  className="border-black"
                />
              </div>
              {!childId && (
                <div>
                  <Select
                    value={newMilestone.childId}
                    onValueChange={(value) => setNewMilestone(prev => ({ ...prev, childId: value }))}
                  >
                    <SelectTrigger className="border-black">
                      <SelectValue placeholder="Select child" />
                    </SelectTrigger>
                    <SelectContent>
                      {myChildren.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.first_name} {child.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Textarea
                  placeholder="Additional notes (optional)"
                  value={newMilestone.notes}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, notes: e.target.value }))}
                  className="border-black"
                />
              </div>
              <Button 
                onClick={handleCreateMilestone}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Record Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="border-black bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg text-black flex items-center space-x-2">
                    <Award className="h-5 w-5 text-black" />
                    <span>{milestone.title}</span>
                  </CardTitle>
                  {milestone.children && (
                    <p className="text-sm text-black">
                      {milestone.children.first_name} {milestone.children.last_name}
                    </p>
                  )}
                </div>
                <Badge className={getCategoryStyle(milestone.category)}>
                  {categories.find(c => c.value === milestone.category)?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {milestone.description && (
                <p className="text-black">{milestone.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-black">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(milestone.achieved_date).toLocaleDateString()}</span>
                </div>
                {milestone.profiles && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>
                      Recorded by {milestone.profiles.first_name} {milestone.profiles.last_name}
                    </span>
                  </div>
                )}
              </div>

              {milestone.notes && (
                <div className="bg-gray-50 border border-black p-3 rounded">
                  <p className="text-sm text-black">{milestone.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {milestones.length === 0 && (
        <Card className="border-black bg-white">
          <CardContent className="p-12 text-center">
            <Award className="mx-auto h-16 w-16 text-black mb-4" />
            <h3 className="text-xl font-medium text-black mb-2">No Milestones Yet</h3>
            <p className="text-black mb-6 max-w-md mx-auto">
              Start recording important milestones and achievements in your child's development.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChildMilestones;
