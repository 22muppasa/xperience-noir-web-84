
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
      console.log('Fetching admin settings from Supabase...');
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching admin settings:', error);
        throw error;
      }

      console.log('Fetched admin settings:', data);
      return data as AdminSetting[];
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      console.log('Updating setting:', key, 'with value:', value);
      
      // Validate security limits
      if (key === 'security_limits') {
        if (value.max_children_per_parent < 1 || value.max_children_per_parent > 20) {
          throw new Error('Max children per parent must be between 1 and 20');
        }
        if (value.max_work_items_per_child < 10 || value.max_work_items_per_child > 500) {
          throw new Error('Max work items per child must be between 10 and 500');
        }
        if (value.password_min_length < 6 || value.password_min_length > 50) {
          throw new Error('Password minimum length must be between 6 and 50');
        }
        if (value.max_login_attempts < 3 || value.max_login_attempts > 10) {
          throw new Error('Max login attempts must be between 3 and 10');
        }
      }

      // Update or insert the setting in Supabase
      const { data, error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'setting_key'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      console.log('Setting updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Settings updated",
        description: "Platform settings have been saved successfully",
      });
    },
    onError: (error: any) => {
      console.error('Settings update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getSetting = (key: string) => {
    const setting = settings?.find(setting => setting.setting_key === key);
    console.log(`Getting setting ${key}:`, setting?.setting_value);
    return setting?.setting_value;
  };

  const updateSetting = (key: string, value: any) => {
    updateSettingMutation.mutate({ key, value });
  };

  // Helper functions to check specific settings
  const isEnrollmentAutoApproval = () => {
    return getSetting('enrollment_auto_approval')?.enabled || false;
  };

  const getMaxChildrenPerParent = () => {
    return getSetting('security_limits')?.max_children_per_parent || 5;
  };

  const getMaxWorkItemsPerChild = () => {
    return getSetting('security_limits')?.max_work_items_per_child || 50;
  };

  const requiresEmailVerification = () => {
    return getSetting('security_limits')?.require_email_verification || true;
  };

  const getPasswordMinLength = () => {
    return getSetting('security_limits')?.password_min_length || 8;
  };

  const getMaxLoginAttempts = () => {
    return getSetting('security_limits')?.max_login_attempts || 5;
  };

  const getExternalProgramsSettings = () => {
    const setting = getSetting('external_programs');
    console.log('External programs setting retrieved:', setting);
    return setting || {
      enabled: false,
      link: '',
      description: ''
    };
  };

  return {
    settings,
    isLoading,
    getSetting,
    updateSetting,
    isUpdating: updateSettingMutation.isPending,
    // Helper methods
    isEnrollmentAutoApproval,
    getMaxChildrenPerParent,
    getMaxWorkItemsPerChild,
    requiresEmailVerification,
    getPasswordMinLength,
    getMaxLoginAttempts,
    getExternalProgramsSettings
  };
};
