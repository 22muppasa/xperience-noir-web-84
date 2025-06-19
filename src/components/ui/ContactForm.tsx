// src/components/ui/ContactForm.tsx
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
      });
    setIsSubmitting(false);

    if (error) {
      console.error('Insert error:', error);
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Submitted!', description: 'Thanks for reaching out—we’ll be in touch soon.' });
      setName(''); setEmail(''); setSubject(''); setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full border-black rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 block w-full border-black rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-black">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="mt-1 block w-full border-black rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-black">Message</label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="mt-1 block w-full border-black rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
