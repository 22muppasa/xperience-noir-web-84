
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  project_url?: string;
  technologies: string[];
  metrics: Record<string, any>;
  duration?: string;
  team_size?: string;
  status: 'draft' | 'published' | 'archived';
  sort_order: number;
}

interface EditProjectDialogProps {
  project: PortfolioProject;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProjectFormData {
  name: string;
  category: string;
  description: string;
  image_url: string;
  project_url?: string;
  technologies: string;
  duration?: string;
  team_size?: string;
  status: 'draft' | 'published' | 'archived';
  metrics_engagement?: string;
  metrics_completion?: string;
  metrics_satisfaction?: string;
}

const categories = [
  'Education Technology',
  'Healthcare & Wellness',
  'Technology Startup',
  'E-commerce',
  'Financial Services',
  'Sustainability',
  'Manufacturing',
  'Real Estate',
  'Entertainment',
  'Non-Profit',
];

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  isOpen,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectFormData>();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        category: project.category,
        description: project.description,
        image_url: project.image_url,
        project_url: project.project_url || '',
        technologies: project.technologies.join(', '),
        duration: project.duration || '',
        team_size: project.team_size || '',
        status: project.status,
        metrics_engagement: project.metrics.engagement || '',
        metrics_completion: project.metrics.completion || '',
        metrics_satisfaction: project.metrics.satisfaction || '',
      });
    }
  }, [project, reset]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
      const metrics: Record<string, string> = {};
      
      if (data.metrics_engagement) metrics.engagement = data.metrics_engagement;
      if (data.metrics_completion) metrics.completion = data.metrics_completion;
      if (data.metrics_satisfaction) metrics.satisfaction = data.metrics_satisfaction;

      const { error } = await supabase
        .from('portfolio_projects')
        .update({
          name: data.name,
          category: data.category,
          description: data.description,
          image_url: data.image_url,
          project_url: data.project_url || null,
          technologies,
          metrics,
          duration: data.duration || null,
          team_size: data.team_size || null,
          status: data.status,
        })
        .eq('id', project.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });
      toast({
        title: 'Project updated',
        description: 'Your portfolio project has been updated successfully.',
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    updateProjectMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Project name is required' })}
                placeholder="Enter project name"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue('category', value)} defaultValue={project.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe the project in detail"
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              {...register('image_url', { required: 'Image URL is required' })}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
          </div>

          <div>
            <Label htmlFor="project_url">Project URL</Label>
            <Input
              id="project_url"
              {...register('project_url')}
              placeholder="https://example.com (optional)"
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies</Label>
            <Input
              id="technologies"
              {...register('technologies')}
              placeholder="React, Node.js, PostgreSQL (comma-separated)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="8 weeks"
              />
            </div>

            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                {...register('team_size')}
                placeholder="6 people"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Metrics (optional)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                {...register('metrics_engagement')}
                placeholder="Engagement (+67%)"
              />
              <Input
                {...register('metrics_completion')}
                placeholder="Completion (+43%)"
              />
              <Input
                {...register('metrics_satisfaction')}
                placeholder="Satisfaction (4.8/5)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value as 'draft' | 'published' | 'archived')} defaultValue={project.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
