
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
        <Button className="bg-blue-700 hover:bg-blue-800 text-white border-0 shadow-lg px-6 py-3 font-semibold text-base">
          {replyTo ? (
            <>
              <MessageSquare className="h-5 w-5 mr-2" />
              Reply
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border-2 border-gray-400 shadow-2xl">
        <DialogHeader className="border-b-2 border-gray-300 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-black">
              {dialogTitle}
            </DialogTitle>
            {replyTo && (
              <div className="text-sm text-gray-800 font-medium">
                Replying to: {replyTo.subject}
              </div>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div>
            <Label htmlFor="recipient" className="text-base font-bold text-black mb-3 block">
              Send to *
            </Label>
            <Select 
              value={recipientId} 
              onValueChange={setRecipientId}
              disabled={!!replyTo}
            >
              <SelectTrigger className="bg-white border-2 border-gray-400 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12">
                <SelectValue placeholder="Select an admin to message" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-400 shadow-xl">
                {admins.map((admin) => (
                  <SelectItem 
                    key={admin.id} 
                    value={admin.id} 
                    className="text-black hover:bg-gray-100 focus:bg-gray-100 font-medium py-3"
                  >
                    {admin.first_name} {admin.last_name} ({admin.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject" className="text-base font-bold text-black mb-3 block">
              Subject *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              className="bg-white border-2 border-gray-400 text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 font-medium"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-base font-bold text-black mb-3 block">
              Message *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={replyTo ? 10 : 6}
              className="bg-white border-2 border-gray-400 text-black placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-base"
              required
            />
          </div>
          
          <div className="flex space-x-4 pt-6 border-t-2 border-gray-300">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-2 border-gray-400 text-black hover:bg-gray-100 hover:border-gray-500 px-6 py-3 font-semibold text-base"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white border-0 shadow-lg px-6 py-3 font-semibold text-base"
            >
              <Send className="h-5 w-5 mr-2" />
              {sendMessageMutation.isPending ? 'Sending...' : buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposer;
