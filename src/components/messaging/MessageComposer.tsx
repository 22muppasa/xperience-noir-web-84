
import React, { useState, useEffect } from 'react';
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
import { MessageSquare, Send, X } from 'lucide-react';

interface AdminProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface MessageComposerProps {
  replyTo?: {
    id: string;
    subject: string;
    sender_id: string;
    content: string;
    created_at: string;
    sender?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  } | null;
}

const MessageComposer = ({ replyTo }: MessageComposerProps) => {
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

  // Auto-populate fields when replying
  useEffect(() => {
    if (replyTo && isOpen) {
      setRecipientId(replyTo.sender_id);
      setSubject(replyTo.subject.startsWith('Re: ') ? replyTo.subject : `Re: ${replyTo.subject}`);
      
      const senderName = replyTo.sender 
        ? `${replyTo.sender.first_name} ${replyTo.sender.last_name}`
        : 'Admin';
      
      setContent(`\n\n--- Original Message ---\nFrom: ${senderName}\nDate: ${new Date(replyTo.created_at).toLocaleString()}\nSubject: ${replyTo.subject}\n\n${replyTo.content}`);
    }
  }, [replyTo, isOpen]);

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
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
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

  const resetForm = () => {
    setRecipientId('');
    setSubject('');
    setContent('');
  };

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !replyTo) {
      resetForm();
    }
  };

  const buttonText = replyTo ? 'Reply' : 'Send Message';
  const dialogTitle = replyTo ? 'Reply to Message' : 'Send Message to Admin';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm">
          {replyTo ? (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {dialogTitle}
            </DialogTitle>
            {replyTo && (
              <div className="text-sm text-gray-600">
                Replying to: {replyTo.subject}
              </div>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium text-gray-700 mb-2 block">
              Send to *
            </Label>
            <Select 
              value={recipientId} 
              onValueChange={setRecipientId}
              disabled={!!replyTo}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select an admin to message" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {admins.map((admin) => (
                  <SelectItem 
                    key={admin.id} 
                    value={admin.id} 
                    className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {admin.first_name} {admin.last_name} ({admin.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
              Subject *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2 block">
              Message *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={replyTo ? 10 : 6}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendMessageMutation.isPending ? 'Sending...' : buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposer;
