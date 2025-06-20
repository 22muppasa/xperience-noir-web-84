
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  max_participants: number | null;
  status: 'draft' | 'published';
}

interface EditProgramDialogProps {
  program: Program;
}

const EditProgramDialog = ({ program }: EditProgramDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: program.title,
    description: program.description || '',
    start_date: program.start_date || '',
    end_date: program.end_date || '',
    price: program.price?.toString() || '',
    max_participants: program.max_participants?.toString() || '',
    status: program.status as 'draft' | 'published'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProgramMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      const { error } = await supabase
        .from('programs')
        .update({
          title: updatedData.title,
          description: updatedData.description || null,
          start_date: updatedData.start_date || null,
          end_date: updatedData.end_date || null,
          price: updatedData.price ? parseFloat(updatedData.price) : null,
          max_participants: updatedData.max_participants ? parseInt(updatedData.max_participants) : null,
          status: updatedData.status
        })
        .eq('id', program.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Program updated",
        description: "The program has been updated successfully.",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgramMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-black text-white">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-black max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-white text-black border-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white text-black border-black"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="bg-white text-black border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">End Date</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="bg-white text-black border-black"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Price ($)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="bg-white text-black border-black"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Max Participants</label>
              <Input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                className="bg-white text-black border-black"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Status</label>
            <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({...formData, status: value})}>
              <SelectTrigger className="bg-white text-black border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="submit"
              disabled={updateProgramMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {updateProgramMutation.isPending ? 'Updating...' : 'Update Program'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-black text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProgramDialog;
