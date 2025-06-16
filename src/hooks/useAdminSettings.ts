
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
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as AdminSetting[];
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
