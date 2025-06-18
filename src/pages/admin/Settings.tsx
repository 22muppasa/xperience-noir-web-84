
import React, { useState, useEffect } from 'react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Shield,
  Bell,
  FileCheck
} from 'lucide-react';

const AdminSettings = () => {
  const { getSetting, updateSetting, isLoading } = useAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
    // Enrollment settings
    enrollmentAutoApproval: false,
    
    // Notification settings
    workUploadNotifications: true,
    notifyAdminsOnUpload: true,
    notifyParentsOnUpload: true,
    
    // Parent-child settings
    requireParentApproval: true,
    autoNotifyOnRequests: true,
    allowSelfAssociation: false,
    
    // Security limits
    maxChildrenPerParent: 5,
    maxWorkItemsPerChild: 50,
    maxProgramsPerSeason: 15,
    sessionTimeoutHours: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireEmailVerification: true,
    enforceStrongPasswords: true,
    
    // Content moderation
    requireApprovalForWork: false,
    autoScanContent: true,
    maxFileSizeMB: 50
  });

  useEffect(() => {
    if (!isLoading) {
      const enrollmentSettings = getSetting('enrollment_auto_approval') || {};
      const workNotifications = getSetting('work_upload_notifications') || {};
      const parentSettings = getSetting('parent_child_requests') || {};
      const securityLimits = getSetting('security_limits') || {};
      const contentSettings = getSetting('content_moderation') || {};

      setLocalSettings(prev => ({
        ...prev,
        // Enrollment
        enrollmentAutoApproval: enrollmentSettings.enabled ?? false,
        
        // Notifications
        workUploadNotifications: workNotifications.enabled ?? true,
        notifyAdminsOnUpload: workNotifications.notify_admins ?? true,
        notifyParentsOnUpload: workNotifications.notify_parents ?? true,
        
        // Parent-child
        requireParentApproval: parentSettings.require_admin_approval ?? true,
        autoNotifyOnRequests: parentSettings.auto_notify_admins ?? true,
        allowSelfAssociation: parentSettings.allow_self_association ?? false,
        
        // Security
        maxChildrenPerParent: securityLimits.max_children_per_parent ?? 5,
        maxWorkItemsPerChild: securityLimits.max_work_items_per_child ?? 50,
        maxProgramsPerSeason: securityLimits.max_programs_per_season ?? 15,
        sessionTimeoutHours: securityLimits.session_timeout_hours ?? 24,
        maxLoginAttempts: securityLimits.max_login_attempts ?? 5,
        passwordMinLength: securityLimits.password_min_length ?? 8,
        requireEmailVerification: securityLimits.require_email_verification ?? true,
        enforceStrongPasswords: securityLimits.enforce_strong_passwords ?? true,
        
        // Content
        requireApprovalForWork: contentSettings.require_approval_for_work ?? false,
        autoScanContent: contentSettings.auto_scan_uploaded_content ?? true,
        maxFileSizeMB: contentSettings.max_file_size_mb ?? 50
      }));
    }
  }, [isLoading, getSetting]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save enrollment settings
    updateSetting('enrollment_auto_approval', {
      enabled: localSettings.enrollmentAutoApproval
    });

    // Save notification settings
    updateSetting('work_upload_notifications', {
      enabled: localSettings.workUploadNotifications,
      notify_admins: localSettings.notifyAdminsOnUpload,
      notify_parents: localSettings.notifyParentsOnUpload
    });

    // Save parent-child settings
    updateSetting('parent_child_requests', {
      require_admin_approval: localSettings.requireParentApproval,
      auto_notify_admins: localSettings.autoNotifyOnRequests,
      allow_self_association: localSettings.allowSelfAssociation
    });

    // Save security limits
    updateSetting('security_limits', {
      max_children_per_parent: localSettings.maxChildrenPerParent,
      max_work_items_per_child: localSettings.maxWorkItemsPerChild,
      max_programs_per_season: localSettings.maxProgramsPerSeason,
      session_timeout_hours: localSettings.sessionTimeoutHours,
      max_login_attempts: localSettings.maxLoginAttempts,
      password_min_length: localSettings.passwordMinLength,
      require_email_verification: localSettings.requireEmailVerification,
      enforce_strong_passwords: localSettings.enforceStrongPasswords
    });

    // Save content moderation settings
    updateSetting('content_moderation', {
      require_approval_for_work: localSettings.requireApprovalForWork,
      auto_scan_uploaded_content: localSettings.autoScanContent,
      max_file_size_mb: localSettings.maxFileSizeMB,
      blocked_file_types: ['exe', 'bat', 'cmd']
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Platform Settings</h2>
          <p className="text-black">
            Configure platform behavior, security, and policies
          </p>
        </div>

        <Tabs defaultValue="enrollment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-black">
            <TabsTrigger value="enrollment" className="text-black">
              <Users className="h-4 w-4 mr-2" />
              Enrollment
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-black">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-black">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="content" className="text-black">
              <FileCheck className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Enrollment Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-approve Enrollments</Label>
                    <p className="text-sm text-black">
                      Automatically approve new program enrollments without admin review
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enrollmentAutoApproval}
                    onCheckedChange={(checked) => handleSettingChange('enrollmentAutoApproval', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Parent-Child Approval</Label>
                    <p className="text-sm text-black">
                      Require admin approval for parent-child association requests
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.requireParentApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireParentApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Allow Self-Association</Label>
                    <p className="text-sm text-black">
                      Allow parents to directly link children without admin approval
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.allowSelfAssociation}
                    onCheckedChange={(checked) => handleSettingChange('allowSelfAssociation', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Work Upload Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Enable Notifications</Label>
                    <p className="text-sm text-black">
                      Send notifications when kids work links are shared
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.workUploadNotifications}
                    onCheckedChange={(checked) => handleSettingChange('workUploadNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Notify Admins</Label>
                    <p className="text-sm text-black">
                      Also notify admins when new work links are shared
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.notifyAdminsOnUpload}
                    onCheckedChange={(checked) => handleSettingChange('notifyAdminsOnUpload', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Notify Parents</Label>
                    <p className="text-sm text-black">
                      Notify parents when their child's work is uploaded
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.notifyParentsOnUpload}
                    onCheckedChange={(checked) => handleSettingChange('notifyParentsOnUpload', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-notify on Requests</Label>
                    <p className="text-sm text-black">
                      Send notifications to admins for new association requests
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoNotifyOnRequests}
                    onCheckedChange={(checked) => handleSettingChange('autoNotifyOnRequests', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Platform Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxChildren" className="text-black">Max Children per Parent</Label>
                    <Input
                      id="maxChildren"
                      type="number"
                      min="1"
                      max="20"
                      value={localSettings.maxChildrenPerParent}
                      onChange={(e) => handleSettingChange('maxChildrenPerParent', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxWork" className="text-black">Max Work Items per Child</Label>
                    <Input
                      id="maxWork"
                      type="number"
                      min="10"
                      max="500"
                      value={localSettings.maxWorkItemsPerChild}
                      onChange={(e) => handleSettingChange('maxWorkItemsPerChild', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrograms" className="text-black">Max Programs per Season</Label>
                    <Input
                      id="maxPrograms"
                      type="number"
                      min="5"
                      max="100"
                      value={localSettings.maxProgramsPerSeason}
                      onChange={(e) => handleSettingChange('maxProgramsPerSeason', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Authentication Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passwordLength" className="text-black">Minimum Password Length</Label>
                    <Input
                      id="passwordLength"
                      type="number"
                      min="6"
                      max="50"
                      value={localSettings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttempts" className="text-black">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={localSettings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Email Verification</Label>
                    <p className="text-sm text-black">
                      Users must verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Enforce Strong Passwords</Label>
                    <p className="text-sm text-black">
                      Require uppercase, lowercase, numbers, and special characters
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enforceStrongPasswords}
                    onCheckedChange={(checked) => handleSettingChange('enforceStrongPasswords', checked)}
                  />
                </div>

                <div>
                  <Label className="text-black">Session Timeout</Label>
                  <p className="text-sm text-black mb-2">
                    Automatically log out users after inactivity
                  </p>
                  <Select 
                    value={localSettings.sessionTimeoutHours.toString()}
                    onValueChange={(value) => handleSettingChange('sessionTimeoutHours', parseInt(value))}
                  >
                    <SelectTrigger className="bg-white text-black border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Content Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Approval for Work</Label>
                    <p className="text-sm text-black">
                      All uploaded work must be approved by admins before being visible
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.requireApprovalForWork}
                    onCheckedChange={(checked) => handleSettingChange('requireApprovalForWork', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-scan Content</Label>
                    <p className="text-sm text-black">
                      Automatically scan uploaded content for inappropriate material
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoScanContent}
                    onCheckedChange={(checked) => handleSettingChange('autoScanContent', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div>
                  <Label htmlFor="maxFileSize" className="text-black">Max File Size (MB)</Label>
                  <p className="text-sm text-black mb-2">
                    Maximum size allowed for uploaded files
                  </p>
                  <Input
                    id="maxFileSize"
                    type="number"
                    min="1"
                    max="500"
                    value={localSettings.maxFileSizeMB}
                    onChange={(e) => handleSettingChange('maxFileSizeMB', parseInt(e.target.value))}
                    className="bg-white text-black border-black"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="border-black text-black hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Reset Changes
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
