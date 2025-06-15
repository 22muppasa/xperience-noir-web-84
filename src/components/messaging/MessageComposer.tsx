
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';

interface AdminProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const MessageComposer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: admins = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_profiles');
      if (error) throw error;
      return data as AdminProfile[];
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          subject: subject.trim(),
          content: content.trim(),
          status: 'unread'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Your message has been sent successfully",
      });
      setIsOpen(false);
      setRecipientId('');
      setSubject('');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientId || !subject.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black border border-black hover:bg-gray-100">
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">Send Message to Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-black">Send to *</Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger className="bg-white border-black text-black">
                <SelectValue placeholder="Select an admin to message" />
              </SelectTrigger>
              <SelectContent className="bg-white border-black">
                {admins.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id} className="text-black hover:bg-gray-100">
                    {admin.first_name} {admin.last_name} ({admin.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject" className="text-black">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              className="bg-white border-black text-black placeholder:text-gray-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-black">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="bg-white border-black text-black placeholder:text-gray-500"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-white text-black border-black hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="flex-1 bg-white text-black border border-black hover:bg-gray-100"
            >
              {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposer;
