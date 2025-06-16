
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      // Since admin_settings table might not exist yet, we'll simulate with localStorage for now
      // and return default settings
      const defaultSettings: AdminSetting[] = [
        {
          id: '1',
          setting_key: 'user_registration',
          setting_value: { enabled: true, require_approval: false },
          description: 'User registration settings',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          setting_key: 'email_notifications',
          setting_value: { enabled: true, from_email: 'admin@example.com' },
          description: 'Email notification settings',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          setting_key: 'system_maintenance',
          setting_value: { enabled: false, message: 'System under maintenance' },
          description: 'System maintenance mode',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          setting_key: 'file_storage',
          setting_value: { max_size_mb: 10, allowed_types: ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx'] },
          description: 'File storage settings',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return defaultSettings;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      // For now, we'll store in localStorage until the admin_settings table is available
      const storageKey = `admin_setting_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(value));
      
      return { setting_key: key, setting_value: value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully",
      });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getSetting = (key: string) => {
    return settings?.find(setting => setting.setting_key === key)?.setting_value;
  };

  const updateSetting = (key: string, value: any) => {
    updateSettingMutation.mutate({ key, value });
  };

  return {
    settings,
    isLoading,
    getSetting,
    updateSetting,
    isUpdating: updateSettingMutation.isPending
  };
};
