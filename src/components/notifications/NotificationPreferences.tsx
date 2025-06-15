
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Smartphone } from 'lucide-react';

const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences = [], isLoading } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ type, field, value }: { type: string; field: string; value: any }) => {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [field]: value })
        .eq('user_id', user?.id)
        .eq('notification_type', type);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    }
  });

  const notificationTypes = [
    { id: 'kids_work', label: 'Kids Work Updates', icon: Bell },
    { id: 'enrollment', label: 'Enrollment Updates', icon: Bell },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'system', label: 'System Notifications', icon: Smartphone },
  ];

  const handleToggle = (type: string, field: string, currentValue: boolean) => {
    updatePreferenceMutation.mutate({
      type,
      field,
      value: !currentValue
    });
  };

  const handleFrequencyChange = (type: string, frequency: string) => {
    updatePreferenceMutation.mutate({
      type,
      field: 'digest_frequency',
      value: frequency
    });
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Card className="border-black bg-white">
      <CardHeader>
        <CardTitle className="text-black">Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationTypes.map((notifType) => {
          const pref = preferences.find(p => p.notification_type === notifType.id);
          const Icon = notifType.icon;
          
          return (
            <div key={notifType.id} className="space-y-4 border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-black" />
                <h3 className="font-medium text-black">{notifType.label}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={pref?.email_enabled || false}
                    onCheckedChange={() => handleToggle(notifType.id, 'email_enabled', pref?.email_enabled || false)}
                  />
                  <Label className="text-black">Email</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={pref?.push_enabled || false}
                    onCheckedChange={() => handleToggle(notifType.id, 'push_enabled', pref?.push_enabled || false)}
                  />
                  <Label className="text-black">Push</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-black">Frequency:</Label>
                  <Select
                    value={pref?.digest_frequency || 'immediate'}
                    onValueChange={(value) => handleFrequencyChange(notifType.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
