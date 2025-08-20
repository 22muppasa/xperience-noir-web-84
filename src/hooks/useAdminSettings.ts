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
      console.log('Loading admin settings...');
      
      // Check for stored settings in localStorage
      const getStoredSetting = (key: string, defaultValue: any) => {
        try {
          const stored = localStorage.getItem(`admin_setting_${key}`);
          const result = stored ? JSON.parse(stored) : defaultValue;
          console.log(`Loaded setting ${key}:`, result);
          return result;
        } catch (error) {
          console.error(`Error loading setting ${key}:`, error);
          return defaultValue;
        }
      };

      // Real settings based on actual platform needs
      const defaultSettings: AdminSetting[] = [
        {
          id: '1',
          setting_key: 'enrollment_auto_approval',
          setting_value: getStoredSetting('enrollment_auto_approval', { enabled: false }),
          description: 'Automatically approve new program enrollments',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          setting_key: 'work_upload_notifications',
          setting_value: getStoredSetting('work_upload_notifications', { 
            enabled: true, 
            notify_admins: true,
            notify_parents: true 
          }),
          description: 'Send notifications when kids work is uploaded',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          setting_key: 'parent_child_requests',
          setting_value: getStoredSetting('parent_child_requests', { 
            require_admin_approval: true, 
            auto_notify_admins: true,
            allow_self_association: false 
          }),
          description: 'Parent-child association request settings',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          setting_key: 'security_limits',
          setting_value: getStoredSetting('security_limits', { 
            max_children_per_parent: 5,
            max_work_items_per_child: 50,
            max_programs_per_season: 15,
            session_timeout_hours: 24,
            max_login_attempts: 5,
            password_min_length: 8,
            require_email_verification: true,
            enforce_strong_passwords: true
          }),
          description: 'Security and platform usage limits',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          setting_key: 'content_moderation',
          setting_value: getStoredSetting('content_moderation', {
            require_approval_for_work: false,
            auto_scan_uploaded_content: true,
            blocked_file_types: ['exe', 'bat', 'cmd'],
            max_file_size_mb: 50
          }),
          description: 'Content moderation and safety settings',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          setting_key: 'external_programs',
          setting_value: getStoredSetting('external_programs', {
            enabled: false,
            link: '',
            description: ''
          }),
          description: 'External program platform link management',
          updated_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      console.log('All settings loaded:', defaultSettings);
      return defaultSettings;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      console.log(`Updating setting ${key} with value:`, value);
      
      const storageKey = `admin_setting_${key}`;
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
        console.log(`Successfully saved ${key} to localStorage`);
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        throw new Error('Failed to save setting to local storage');
      }
      
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
      
      // Validate external programs
      if (key === 'external_programs') {
        console.log('Validating external programs setting:', value);
        
        if (value.enabled && !value.link?.trim()) {
          throw new Error('Program link is required when external programs are enabled');
        }
        
        if (value.link && value.link.trim()) {
          const urlPattern = /^https?:\/\/.+\..+/;
          if (!urlPattern.test(value.link)) {
            throw new Error('Program link must be a valid URL starting with http:// or https://');
          }
          
          try {
            new URL(value.link);
          } catch {
            throw new Error('Program link must be a valid URL');
          }
        }
        
        console.log('External programs validation passed');
      }
      
      return { setting_key: key, setting_value: value };
    },
    onSuccess: (data) => {
      console.log('Setting update successful:', data);
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
    const setting = settings?.find(setting => setting.setting_key === key)?.setting_value;
    console.log(`Getting setting ${key}:`, setting);
    return setting;
  };

  const updateSetting = (key: string, value: any) => {
    console.log(`Request to update setting ${key}:`, value);
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

  // External programs helper functions
  const isExternalProgramsEnabled = () => {
    const enabled = getSetting('external_programs')?.enabled || false;
    console.log('isExternalProgramsEnabled:', enabled);
    return enabled;
  };

  const getExternalProgramsLink = () => {
    const link = getSetting('external_programs')?.link || '';
    console.log('getExternalProgramsLink:', link);
    return link;
  };

  const getExternalProgramsDescription = () => {
    const description = getSetting('external_programs')?.description || '';
    console.log('getExternalProgramsDescription:', description);
    return description;
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
    // External programs helpers
    isExternalProgramsEnabled,
    getExternalProgramsLink,
    getExternalProgramsDescription
  };
};
